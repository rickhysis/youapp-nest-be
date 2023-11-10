import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Tokens } from '../types';
import { Public } from '../common/decorators';
import { 
	AuthService, RegisterDto
} from '.';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@ApiBearerAuth() 
@Controller('')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post('/login')
	@HttpCode(HttpStatus.CREATED)
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const token = await this.authService.login(dto);

		res.send({
			data: token,
			success: true,
		});
	}

	@Public()
	@Post('/register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto): Promise<Tokens> {
		return await this.authService.register(dto);
	}

}
