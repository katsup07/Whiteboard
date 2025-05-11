import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DrawingDocument = Drawing & Document;

@Schema({ timestamps: true })
export class Drawing {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dataUrl: string;

  @Prop()
  userId: string;
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing);
