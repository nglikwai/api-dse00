import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document & {
  setPassword(password: string): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  hash: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Review' }])
  reviews: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Campground' }])
  favour: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  friendList: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Campground' }])
  posts: MongooseSchema.Types.ObjectId[];

  @Prop({ default: '考到心儀嘅大學' })
  intro: string;

  @Prop({ default: 1 })
  coin: number;

  @Prop({ default: '1' })
  grade: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 'member' })
  identity: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Password methods (replace passport-local-mongoose)
UserSchema.methods.setPassword = async function (password: string) {
  this.hash = await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.hash);
};
