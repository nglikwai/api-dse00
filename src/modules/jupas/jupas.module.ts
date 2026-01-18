import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JupasService } from './jupas.service';
import { JupasController } from './jupas.controller';
import { Jupas, JupasSchema } from './schemas/jupas.schema';
import { Shrine, ShrineSchema } from './schemas/shrine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Jupas.name, schema: JupasSchema },
      { name: Shrine.name, schema: ShrineSchema },
    ]),
  ],
  controllers: [JupasController],
  providers: [JupasService],
})
export class JupasModule {}
