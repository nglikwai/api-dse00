import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShrineDocument = Shrine & Document;

@Schema({ timestamps: true })
export class Shrine {
  @Prop()
  title: string;

  @Prop()
  name: string;

  @Prop({ min: 10 })
  content: string;

  @Prop()
  shrine: string;

  @Prop()
  subShrine: string;

  @Prop()
  donation: number;
}

export const ShrineSchema = SchemaFactory.createForClass(Shrine);
