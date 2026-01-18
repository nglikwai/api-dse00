import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JupasDocument = Jupas & Document;

@Schema({ timestamps: true })
export class Jupas {
  @Prop()
  program: string;

  @Prop()
  school: string;

  @Prop({ min: 4 })
  year: number;

  @Prop({ min: 4 })
  code: number;

  @Prop()
  chin: number;

  @Prop()
  eng: number;

  @Prop()
  math: number;

  @Prop()
  ls: number;

  @Prop()
  e1: number;

  @Prop()
  e2: number;

  @Prop()
  e3: number;

  @Prop()
  m1m2: number;

  @Prop({ default: 0 })
  like: number;

  @Prop({ default: 0 })
  dislike: number;
}

export const JupasSchema = SchemaFactory.createForClass(Jupas);
