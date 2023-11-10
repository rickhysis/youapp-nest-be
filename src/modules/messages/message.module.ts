import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageSchema, Message } from './schemas/message.schema';
import { MessageRepository } from './repository/message.repository';
import { MessageController } from './message.controller';
import { UserModule } from '../users/user.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessagePublisherService } from './jobs/message-publisher.service';
import { MessageSubscriberService } from './jobs/message-subscriber.service';
import { SocketModule } from '../../providers/socket/socket.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'rmq-message',
                    type: 'fanout',
                },
            ],
            uri: process.env.RABBITMQ_URI,
            connectionInitOptions: { wait: false },
        }),
        SocketModule,
        UserModule
    ],
    exports: [MongooseModule, MessageRepository, MessageService],
    providers: [MessageService, MessageRepository, MessagePublisherService, MessageSubscriberService],
    controllers: [MessageController],
})
export class MessageModule {

}