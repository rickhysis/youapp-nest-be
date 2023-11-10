import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessagePublisherService {
    constructor(private readonly publisher: AmqpConnection) { }

    publishMessage(message: any) {
        const jsonMessage = JSON.stringify(message);
        this.publisher.publish('rmq-message', '', Buffer.from(jsonMessage));
    }
}
