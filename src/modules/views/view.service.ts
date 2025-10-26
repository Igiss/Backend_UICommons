import { InjectModel } from '@nestjs/mongoose';
import { View, ViewDocument } from './view.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(View.name) private readonly viewModel: Model<View>,
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

  async recordView(
    componentId: string,
    accountId?: string,
    ipAddress?: string,
  ): Promise<void> {
    // Check if already viewed in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const query: any = { 
      componentId, 
      viewedAt: { $gte: oneDayAgo } 
    };
    
    if (accountId) {
      query.accountId = accountId;
    } else if (ipAddress) {
      query.ipAddress = ipAddress;
    }

    const existing = await this.viewModel.findOne(query);
    
    if (!existing) {
      await this.viewModel.create({
        componentId,
        accountId,
        ipAddress,
      });
    }
  }
  // 📊 Đếm tổng số lượt xem của 1 component
  async getViewCount(componentId: string): Promise<number> {
    return this.viewModel.countDocuments({ componentId }).exec();
  }
  // unique view for logged in user
  async getUniqueViewCount(componentId: string): Promise<number> {
    const views = await this.viewModel.find({ componentId }).exec();
    const uniqueViewers = new Set(
      views.map(v => v.accountId || v.ipAddress).filter(Boolean)
    );
    return uniqueViewers.size;
  }
}
