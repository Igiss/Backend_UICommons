import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Component } from './component.schema';

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

    @InjectModel('Favourite') private favouriteModel: Model<any>,
    @InjectModel('View') private viewModel: Model<any>,
  ) {}

  async create(createComponentDto: any): Promise<Component> {
    const newComponent = new this.componentModel({
      ...createComponentDto,
      status: 'review',
    });
    return newComponent.save();
  }

  async findAll(): Promise<AggregatedComponent[]> {
    return this.componentModel
      .aggregate<AggregatedComponent>([
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
            from: 'favourites',
            localField: '_id',
            foreignField: 'componentId',
            as: 'favourites',
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
            favouritesCount: { $size: '$favourites' },
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
            favourites: 0,
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

  async findByUserAndStatus(
    accountId: string,
    tab: string,
  ): Promise<Component[]> {
    const query: FilterQuery<Component> = { accountId };

    if (tab === 'post') {
      query.status = 'public';
      query.parentId = { $exists: false };
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

    return this.componentModel.find(query).exec();
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

  async findByStatus(status: string): Promise<AggregatedComponent[]> {
    const result = await this.componentModel
      .aggregate<AggregatedComponent>([
        {
          $match: { status: status },
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
            from: 'favourites',
            localField: '_id',
            foreignField: 'componentId',
            as: 'favourites',
          },
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
          $unwind: {
            path: '$authorDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            viewsCount: { $size: '$views' },
            favouritesCount: { $size: '$favourites' },
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
            favourites: 0,
            authorDetails: 0,
          },
        },
      ])
      .exec();

    console.log(`🔍 findByStatus(${status}) => ${result.length} items`);
    return result ?? [];
  }
}
