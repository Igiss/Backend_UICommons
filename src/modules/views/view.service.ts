import { InjectModel } from '@nestjs/mongoose';
import { View, ViewDocument } from './view.schema';
import { Model } from 'mongoose';

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
}
