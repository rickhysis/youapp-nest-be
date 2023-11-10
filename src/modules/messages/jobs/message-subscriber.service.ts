import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Public } from '../../../common/decorators';
import { MessageService } from '../message.service';

@Injectable()
export class MessageSubscriberService {
    constructor(private readonly messageService: MessageService) { }

    @Public()
    @RabbitSubscribe({
        exchange: 'rmq-message',
        routingKey: '',
    })
    handleMessage(msg: any) {
        console.log(msg)
        this.messageService.create(msg)
    }
}
