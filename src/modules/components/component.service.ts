import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Component } from './component.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel(Component.name)
    private readonly componentModel: Model<Component>,
    @InjectModel('Favourite') private favouriteModel: Model<any>,
    @InjectModel('View') private viewModel: Model<any>,
  ) {}
  async create(createComponentDto: any): Promise<Component> {
    const createdComponent = new this.componentModel(createComponentDto);
    return createdComponent.save();
  }
  async findAll(): Promise<Component[]> {
    return this.componentModel.find().exec();
  }
  async findOne(id: string): Promise<Component | null> {
  return this.componentModel
    .findById(id)
    .populate('accountId', 'userName avatar')
    .exec();
  }

  async findByUserAndStatus(accountId: string, tab: string): Promise<Component[]> {
    const query: any = { accountId };

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

    const favouritesCount = await this.favouriteModel.countDocuments({ 
      componentId: id 
    }).exec();

    const viewsCount = await this.viewModel.countDocuments({ 
      componentId: id 
    }).exec();

    return {
      ...component.toObject(),
      favouritesCount,
      viewsCount,
    };
  }
}
