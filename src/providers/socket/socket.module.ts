import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketService, SocketGateway]
})
export class SocketModule {}