import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Settings extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true, unique: true })
  accountId: Types.ObjectId;

  // Profile Settings
  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  location: string;

  @Prop({ type: String, default: '' })
  company: string;

  @Prop({ type: String, default: '' })
  twitter: string;

  @Prop({ type: String, default: '' })
  website: string;

  @Prop({ type: String, default: '' })
  bio: string;

  // Email Settings
  @Prop({ type: Boolean, default: true })
  emailNotifications: boolean;

  @Prop({
    type: Object,
    default: {
      postReviews: true,
      comments: true,
      newChallenges: true,
      socialMedia: true,
    },
  })
  notificationPreferences: {
    postReviews: boolean;
    comments: boolean;
    newChallenges: boolean;
    socialMedia: boolean;
  };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);