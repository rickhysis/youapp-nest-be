import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessageRepository } from './repository/message.repository';
import { UserService } from '../../modules/users/user.service';
import { MessagePublisherService } from './jobs/message-publisher.service';
import { SocketGateway } from '@/providers/socket/socket.gateway';
import { MessagesResponse } from '@/types/message.type';

@Injectable()
export class MessageService {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly userService: UserService,
        private readonly publisher: MessagePublisherService,
        private readonly socketGateway: SocketGateway,
    ) { }

    async send(userId: string, sendMessageDto: any): Promise<MessagesResponse> {
        const receiver = await this.userService.findUserByUsername(sendMessageDto.username);
        const message = {
            userId,
            ...sendMessageDto
        };

        if (!receiver) {
            return {
                message: 'User not found'
            };
        }

        this.publisher.publishMessage(message);

        return {
            message: 'Succesfull sent message'
        };
    }

    async create(data: any): Promise<void> {
        const receiver = await this.userService.findUserByUsername(data.username);

        if (receiver) {
            const payload = {
                sender_id: data.userId,
                receiver_id: receiver._id,
                message: data.message
            }

            await this.messageRepository.create(payload);
            this.broadcastMessage(payload);
        }
    }

    async broadcastMessage(data: any): Promise<void>{
        const sender = await this.userService.findById(data.sender_id);
       
        const payload = {
            sender_username: sender.username,
            receiver_id: data.receiver_id,
            message: data.message,
            date: new Date
        }

        // define for spesific user
        // this.socketService.sendMessageToUser(data.userId, payload);
        this.socketGateway.handleMessage(payload);
    }

    async findAll(q: any): Promise<Message[]> {
        return await this.messageRepository.findAll(q);
    }

}