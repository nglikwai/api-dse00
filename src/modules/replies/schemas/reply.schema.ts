import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ required: true })
  body: string;

  @Prop()
  rating: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: '622874ccc8ed254d82edf591',
  })
  author: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: MongooseSchema.Types.ObjectId;

  @Prop([String])
  reply: string[];

  @Prop([String])
  replyAuthor: string[];
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
