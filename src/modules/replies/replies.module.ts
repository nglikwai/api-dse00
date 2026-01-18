import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { Reply, ReplySchema } from './schemas/reply.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
