import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, } from 'class-validator';

export class SendMessageDto {
    @ApiProperty({
        description: 'Username',
        example: 'thename',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Message',
        example: 'Hello, how are you?',
    })
    @IsNotEmpty()
    @IsString()
    message: string;
}