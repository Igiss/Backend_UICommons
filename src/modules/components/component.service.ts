// Dán đè toàn bộ nội dung file component.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose'; // 1. Import FilterQuery
import { Component } from './component.schema';

// 2. Định nghĩa interface cho kết quả trả về
// (Giống với IElement bên frontend của bạn)
export interface AggregatedComponent {
  _id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  category: string;
  status: string;
  viewsCount: number;
  favouritesCount: number;
  accountId: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  } | null;
  // Thêm các trường khác nếu có
  reactCode?: string;
  vueCode?: string;
  litCode?: string;
  svelteCode?: string;
}

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel(Component.name)
    private readonly componentModel: Model<Component>,
    // 3. Sửa lỗi chính tả cSpell: 'Favourite' -> 'Favorite'
    // Hoặc thêm 'Favourite' vào từ điển cSpell (xem ở cuối)
    @InjectModel('Favourite') private favouriteModel: Model<any>,
    @InjectModel('View') private viewModel: Model<any>,
  ) {}

  async create(createComponentDto: any): Promise<Component> {
    const createdComponent = new this.componentModel(createComponentDto);
    return createdComponent.save();
  }

  // 4. Sửa hàm findAll để dùng interface
  async findAll(): Promise<AggregatedComponent[]> {
    return this.componentModel
      .aggregate<AggregatedComponent>([
        // Thêm kiểu ở đây
        {
          $match: { status: 'public' },
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'accountId',
            foreignField: '_id',
            as: 'authorDetails',
          },
        },
        {
          $lookup: {
            from: 'views',
            localField: '_id',
            foreignField: 'componentId',
            as: 'views',
          },
        },
        {
          $lookup: {
            from: 'favourites', // Tên collection 'favourites'
            localField: '_id',
            foreignField: 'componentId',
            as: 'favourites', // Tên field tạm thời
          },
        },
        {
          $unwind: {
            path: '$authorDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            viewsCount: { $size: '$views' },
            favouritesCount: { $size: '$favourites' }, // Đếm từ field 'favourites'
            accountId: {
              _id: '$authorDetails._id',
              username: '$authorDetails.userName',
              fullName: '$authorDetails.fullName',
              avatar: '$authorDetails.avatar',
            },
          },
        },
        {
          $project: {
            views: 0,
            favourites: 0, // Xóa field tạm thời 'favourites'
            authorDetails: 0,
          },
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<Component | null> {
    return this.componentModel
      .findById(id)
      .populate('accountId', 'userName avatar')
      .exec();
  }

  // 5. Sửa hàm findByUserAndStatus để dùng FilterQuery
  async findByUserAndStatus(
    accountId: string,
    tab: string,
  ): Promise<Component[]> {
    // Sửa 'any' thành 'FilterQuery<Component>'
    const query: FilterQuery<Component> = { accountId };

    if (tab === 'post') {
      query.status = 'public'; // Đây giờ đã an toàn (type-safe)
      query.parentId = { $exists: false }; // Đây cũng vậy
    } else if (tab === 'variations') {
      query.status = 'public';
      query.parentId = { $exists: true };
    } else if (tab === 'review') {
      query.status = 'review';
    } else if (tab === 'rejected') {
      query.status = 'rejected';
    } else if (tab === 'draft') {
      query.status = 'draft';
    } else {
      throw new Error('Invalid tab');
    }

    return this.componentModel.find(query).exec(); // Lỗi L126 đã được sửa
  }

  async update(
    id: string,
    updateData: Partial<any>,
  ): Promise<Component | null> {
    return this.componentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Component | null> {
    return this.componentModel.findByIdAndDelete(id).exec();
  }

  async findOneWithStats(id: string): Promise<any> {
    const component = await this.componentModel
      .findById(id)
      .populate('accountId', 'userName avatar')
      .exec();

    if (!component) return null;

    const favouritesCount = await this.favouriteModel
      .countDocuments({
        componentId: id,
      })
      .exec();

    const viewsCount = await this.viewModel
      .countDocuments({
        componentId: id,
      })
      .exec();

    return {
      ...component.toObject(),
      favouritesCount,
      viewsCount,
    };
  }
}
