import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  // Tạo Category mới
  async create(data: Partial<Category>): Promise<Category> {
    const created = new this.categoryModel(data);
    return created.save();
  }

  // Lấy tất cả Category
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  // Lấy 1 Category theo ID
  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  // Update Category
  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Category ${id} not found`);
    return updated;
  }

  // Xóa Category
  async remove(id: string): Promise<void> {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Category ${id} not found`);
  }
}
