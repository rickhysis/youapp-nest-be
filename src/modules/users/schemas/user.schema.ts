import { BaseModel } from '../../../base/factories/base-models.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
}

@Schema({ timestamps: true })
export class User extends BaseModel<User> {
  @Prop({ index: true })
  username: string;

  @Prop({ index: true })
  name: string;

  @Prop({ type: String, enum: Object.values(Gender) }) 
  gender: Gender;

  @Prop()
  birth: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;
  
  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  interest: string[];

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  hashdRt: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };