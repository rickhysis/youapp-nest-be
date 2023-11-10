import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'name',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}