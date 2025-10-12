import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
export class Category {
  @Prop({ type: String, default: () => uuidv4() })
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string; // Tên loại, ví dụ: "Button", "Navbar", "Form"

  @Prop()
  description?: string; // Mô tả thêm (có thể bỏ trống)
}

export const CategorySchema = SchemaFactory.createForClass(Category);
