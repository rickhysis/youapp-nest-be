import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(query: { q: string }): Promise<User[]> {
    let filters: mongoose.FilterQuery<UserDocument> = {
      $or: [
        { username: new RegExp(query.q, 'i') },
        { email: new RegExp(query.q, 'i') },
      ],
    };

    if (!query.q) {
      filters = {};
    }

    const result = await this.userModel.find(filters).sort({ createdAt: -1 })

    return result
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async updateOne(userId: string, data: any) {
    return this.userModel.updateOne({ _id: userId }, { $set: data }).exec();
  }

  async findByIdAndUpdate(userId: string, data: any) {
    return this.userModel.findByIdAndUpdate(userId, { $set: data }, { new: true, useFindAndModify: false }).exec();
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).select({ _id: 0, __v: 0, password: 0, hashdRt: 0 }).exec();
  }

  async delete(id: string) {
    return await this.userModel.deleteMany({ _id: id });
  }
}