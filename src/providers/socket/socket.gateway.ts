import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Socket;

    constructor(private readonly socketService: SocketService) { }

    handleConnection(socket: Socket): void {
        this.socketService.handleConnection(socket);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(payload: any): void {
        this.server.emit('message', payload);
    }

}