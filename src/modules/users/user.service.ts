import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: any): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    const createdUser = await this.userRepository.create(createUserDto);
    return createdUser;
  }

  async findAll(q: any): Promise<User[]> {
    return await this.userRepository.findAll(q);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findUserByUsername(username);
  }

  async updateOne(userId: string, data: any) {
    return await this.userRepository.updateOne(userId, data);
  }

  async findById(userId: string) {
    return await this.userRepository.findById(userId);
  }
  
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if(!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);  
    
    return await this.unMask(user);
  }

  async findByIdAndUpdate(userId: string, data: UpdateUserDto) {
    const user = await this.userRepository.findByIdAndUpdate(userId, data); 

    return await this.unMask(user);
  }

  async unMask(user: User) {
    delete user.password;
    delete user.hashdRt;
    delete user._id;
    delete user.__v;

    return user;
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
  
}