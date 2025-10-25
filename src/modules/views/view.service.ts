import { InjectModel } from '@nestjs/mongoose';
import { View, ViewDocument } from './view.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(View.name) private readonly viewModel: Model<ViewDocument>,
  ) {}

  async create(createViewDto: any) {
    const createdView = new this.viewModel(createViewDto);
    return createdView.save();
  }

  async findAll() {
    return this.viewModel.find().exec();
  }

  async findOne(id: string) {
    return this.viewModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<any>) {
    return this.viewModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.viewModel.findByIdAndDelete(id).exec();
  }

  // 🧠 Ghi lại view, tránh trùng (1 user xem 1 component chỉ tính 1 lần)
  async recordView(componentId: string, accountId: string) {
    const exists = await this.viewModel.findOne({ componentId, accountId });
    if (!exists) {
      await this.viewModel.create({ componentId, accountId });
    }
  }

  // 📊 Đếm tổng số lượt xem của 1 component
  async countViews(componentId: string): Promise<number> {
    return this.viewModel.countDocuments({ componentId });
  }
}
