import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessageRepository {
    constructor(@InjectModel(Message.name) private MessageModel: Model<MessageDocument>) { }

    async create(createMessageDto: any): Promise<Message> {
        const createdMessage = new this.MessageModel(createMessageDto);
        return createdMessage.save();
    }

    async findAll(query: { q: string }): Promise<Message[]> {
        let filters: mongoose.FilterQuery<MessageDocument> = {
            $or: [
                { sender_id: new RegExp(query.q, 'i') },
                { receiver_id: new RegExp(query.q, 'i') },
            ],
        };

        if (!query.q) {
            filters = {};
        }

        const result = await this.MessageModel.find(filters)
            .select({ _id: 0, __v: 0, updatedAt: 0 })
            .populate('sender_id', { _id: 0, username: 1, email: 1, gender: 1, horoscope: 1, zodiac: 1 })
            .populate('receiver_id', { _id: 0, username: 1, email: 1, gender: 1, horoscope: 1, zodiac: 1 })
            .sort({ createdAt: -1 });

        return result
    }

}