import { Module, ValidationPipe } from '@nestjs/common';
import { DataBaseModule } from './providers/database/mongo/provider.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './modules/messages/message.module';
import { SocketModule } from './providers/socket/socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ServeStaticModule .forRoot({
			rootPath: join(__dirname, '..', 'client'),
			exclude: ['/api/(.*)', '/api-docs/(.*)'],
		}),
		DataBaseModule,
		SocketModule,
		AuthModule,
		UserModule,
		MessageModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AccessTokenGuard,
		},
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		},
	],
})
export class AppModule { }