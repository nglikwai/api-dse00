import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type PostDocument = Post & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '如題' })
  description: string;

  @Prop({ default: 0 })
  favour: number;

  @Prop({ default: 0 })
  popular: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: '622874ccc8ed254d82edf591',
  })
  author: MongooseSchema.Types.ObjectId;

  @Prop({ default: '吹水' })
  category: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Reply' }])
  reviews: MongooseSchema.Types.ObjectId[];

  @Prop({ default: 'DSEJJ' })
  display_name: string;

  @Prop()
  post_group: string;

  @Prop()
  ip: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// CASCADE DELETE MIDDLEWARE (CRITICAL)
PostSchema.post('findOneAndDelete', async function (this: any, doc: any) {
  if (doc) {
    const ReplyModel = this.model('Reply');
    await ReplyModel.deleteMany({ _id: { $in: doc.reviews } });
  }
});

// Pagination plugin
PostSchema.plugin(mongoosePaginate);
