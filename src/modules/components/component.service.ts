import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Component } from './component.schema';

export class ComponentService {
  constructor(
    @InjectModel(Component.name)
    private readonly componentModel: Model<Component>,
  ) {}
  async create(createComponentDto: any): Promise<Component> {
    const createdComponent = new this.componentModel(createComponentDto);
    return createdComponent.save();
  }
  async findAll(): Promise<Component[]> {
    return this.componentModel.find().exec();
  }
  async findOne(id: string): Promise<Component | null> {
    return this.componentModel.findById(id).exec();
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
}
