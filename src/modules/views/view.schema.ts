import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ViewDocument = HydratedDocument<View>;

@Schema() // Không cần timestamps vì đã có viewedAt
export class View {
  @Prop({ type: String, default: () => uuidv4() })
  _id?: string;

  @Prop({ default: Date.now })
  viewedAt: Date;

  @Prop({ type: String, ref: 'Component', required: true })
  componentId: string;

  @Prop({ type: String, ref: 'Account', required: true })
  accountId: string;
}

export const ViewSchema = SchemaFactory.createForClass(View);
ViewSchema.index({ accountId: 1, componentId: 1 }, { unique: true });
