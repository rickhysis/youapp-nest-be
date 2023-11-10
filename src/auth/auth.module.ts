import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/users/user.module';
import { AcccessTokenStrategiest, RefreshTokenStrategiest } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
@Module({
  imports: [JwtModule.register({}), UserModule],

  providers: [AuthService, AcccessTokenStrategiest, RefreshTokenStrategiest],
  controllers: [AuthController],
})
export class AuthModule {}