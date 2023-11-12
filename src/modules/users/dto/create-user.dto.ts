import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsArray, IsNotEmpty } from 'class-validator';
import { Gender } from '../schemas/user.schema';


export class CreateUserDto {
    @ApiProperty({
        description: 'Name',
        example: 'My Name',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Gender',
        example: 'Male',
    })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({
        description: 'Date',
        example: '12-12-2020',
    })
    @IsString()
    birth: string;

    @ApiProperty({
        description: 'Horoscope',
        example: 'Cancer',
    })
    @IsString()
    horoscope: string;

    @ApiProperty({
        description: 'Zodiac',
        example: 'Dog',
    })
    @IsString()
    zodiac: string;

    @ApiProperty({
        description: 'Height',
        example: 170,
    })
    @IsString()
    height: string;

    @ApiProperty({
        description: 'Weight',
        example: 100,
    })
    @IsString()
    weight: string;

    @ApiProperty({
        description: 'Interest',
        example: ['Music', 'Singing'],
    })
    @IsArray()
    @IsOptional()
    interest: string[];

    hashdRt: string;
}