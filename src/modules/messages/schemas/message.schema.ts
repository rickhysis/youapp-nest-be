import { UserDocument } from '@/modules/users/schemas/user.schema';
import { BaseModel } from '../../../base/factories/base-models.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message extends BaseModel<Message> {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    sender_id: UserDocument;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    receiver_id: UserDocument;

    @Prop()
    message: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

}

const MessageSchema = SchemaFactory.createForClass(Message);

export { MessageSchema };