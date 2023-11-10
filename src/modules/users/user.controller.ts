import {
    Body,
    Controller,
    Put,
    Get,
    Post,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('')
export class UsersController {
    constructor(private readonly usersService: UserService) { }

    @Post('/createProfile')
    @HttpCode(HttpStatus.OK)
    async create(@GetCurrentUserId() userId: string, @Body() createUserDto: CreateUserDto) {
        return await this.usersService.findByIdAndUpdate(userId, createUserDto);
    }

	@Get('/getProfile')
    @HttpCode(HttpStatus.OK)
	async profile(@GetCurrentUserId() userId: string) {
		return await this.usersService.getProfile(userId);
	}

    @Put('/updateProfile')
    @HttpCode(HttpStatus.OK)
    async update(@GetCurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.findByIdAndUpdate(userId, updateUserDto);
    }

}