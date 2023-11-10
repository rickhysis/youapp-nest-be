import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../modules/users/user.service';

import { Tokens } from './../types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    const user: any = await this.userService.findUserByEmail(dto.email);

    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);  

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);   

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });

    return tokens;
  }

  async register(dto: RegisterDto): Promise<Tokens> {
    const { email } = dto;

    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser)  throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);  

    const user: any = await this.userService.create(dto);

    const tokens = await this.getTokens(user);

    const rtHash = await this.hashPassword(tokens.refresh_token);

    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    return tokens;
  }

  async getTokens(user: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: 'rt-secret',
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashPassword(data: string) : Promise<string>{
    return bcrypt.hash(data, 10);
  }
}