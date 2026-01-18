import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModerationService } from './moderation.service';
import { Blockuser, BlockuserSchema } from './schemas/blockuser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blockuser.name, schema: BlockuserSchema },
    ]),
  ],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
