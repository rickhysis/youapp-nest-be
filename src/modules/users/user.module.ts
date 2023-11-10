import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserSchema, User } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule, UserRepository, UserService],
  providers: [UserService, UserRepository],
  controllers: [UsersController],
})
export class UserModule {

}