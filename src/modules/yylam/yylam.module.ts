import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YylamService } from './yylam.service';
import { YylamController } from './yylam.controller';
import { Yylam, YylamSchema } from './schemas/yylam.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Yylam.name, schema: YylamSchema }]),
  ],
  controllers: [YylamController],
  providers: [YylamService],
})
export class YylamModule {}
