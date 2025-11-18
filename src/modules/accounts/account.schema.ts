import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true, _id: false }) // Tắt auto _id
export class Account extends Document {
  @Prop({ type: String, required: true }) // Dùng String cho UUID
  declare _id: string; // Thêm declare để override _id từ Document

  @Prop({ type: String, required: false }) // Không required
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false }) // Không required
  password: string;

  @Prop({ type: String, required: false })
  refreshToken: string;

  // Profile Settings
  @Prop({ type: String, required: false }) // userName có sẵn từ OAuth
  userName: string; // Tên hiển thị - Field này đã có trong MongoDB

  @Prop({ type: String, required: false }) // Không required, sẽ thêm khi user update
  bio: string;

  @Prop({ type: String, required: false })
  avatar: string;

  // Provider fields (cho OAuth login)
  @Prop({ type: String, required: false })
  provider: string;

  @Prop({ type: String, required: false })
  providerId: string;

  // Email Settings
  @Prop({ type: Boolean, required: false })
  emailNotifications: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  notificationPreferences: {
    postReviews: boolean;
    comments: boolean;
    newChallenges: boolean;
    socialMedia: boolean;
  };
}

export const AccountSchema = SchemaFactory.createForClass(Account);
