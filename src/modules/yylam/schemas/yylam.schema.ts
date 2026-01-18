import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type YylamDocument = Yylam & Document;

@Schema()
export class Yylam {
  @Prop()
  title: string;

  @Prop()
  author: string;
}

export const YylamSchema = SchemaFactory.createForClass(Yylam);
