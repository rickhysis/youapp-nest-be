import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';

@ApiTags('Message')
@ApiBearerAuth()
@Controller('')
export class MessageController {
  constructor(private readonly messagesService: MessageService) { }

  @Post('/sendMessage')
  @HttpCode(HttpStatus.OK)
  async send(@GetCurrentUserId() userId: string, @Body() createMessageDto: SendMessageDto) {
    return await this.messagesService.send(userId, createMessageDto);
  }

  @Get('/viewMessages')
  @HttpCode(HttpStatus.OK)
  async view(@GetCurrentUserId() userId: string) {
    return await this.messagesService.findAll(userId);
  }


}