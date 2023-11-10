import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  sendMessageToUser(userId: string, message: any) {
    const userSocket = this.connectedClients.get(userId);

    if (userSocket) {
      userSocket.emit('message', { userId, message });
    } else {
      console.log(`User with ID ${userId} is not connected.`);
    }
  }

}