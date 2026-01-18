import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlockuserDocument = Blockuser & Document;

@Schema({ timestamps: true })
export class Blockuser {
  @Prop()
  ip: string;

  @Prop()
  title: string;

  @Prop()
  display_name: string;
}

export const BlockuserSchema = SchemaFactory.createForClass(Blockuser);
