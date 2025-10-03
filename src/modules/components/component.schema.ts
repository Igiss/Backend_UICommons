import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../accounts/account.schema'; // Import để type hinting

export type ComponentDocument = HydratedDocument<Component>;

@Schema({ timestamps: true })
export class Component {
  @Prop({ type: String, default: () => uuidv4() })
  _id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  htmlCode: string;

  @Prop({ required: true })
  cssCode: string;

  @Prop({ required: false }) // hoặc bỏ trống nếu không bắt buộc
  reactCode?: string;

  @Prop({ required: false })
  vueCode?: string;

  @Prop({ required: false })
  litCode?: string;

  @Prop({ required: false })
  svelteCode?: string;

  // Mối quan hệ với Account
  @Prop({ type: String, ref: 'Account', required: true })
  accountId: string; // Chỉ lưu ID

  // Có thể thêm thuộc tính này để nhận dữ liệu sau khi populate
  account?: Account;
}

export const ComponentSchema = SchemaFactory.createForClass(Component);
