import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favourite } from './favourite.schema';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name)
    private readonly favouriteModel: Model<Favourite>,
  ) {}

  // Thêm component vào favorites
  async addToFavourites(
    accountId: string,
    componentId: string,
  ): Promise<Favourite> {
    // Kiểm tra xem đã tồn tại chưa
    const existing = await this.favouriteModel.findOne({
      accountId,
      componentId,
    });
    if (existing) {
      throw new ConflictException('Component already in favourites');
    }

    const favourite = new this.favouriteModel({
      accountId,
      componentId,
    });
    return favourite.save();
  }

  // Xóa component khỏi favorites
  async removeFromFavourites(
    accountId: string,
    componentId: string,
  ): Promise<void> {
    const result = await this.favouriteModel.deleteOne({
      accountId,
      componentId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Favourite not found');
    }
  }

  // Toggle favourite (thêm nếu chưa có, xóa nếu đã có)
  async toggleFavourite(
    accountId: string,
    componentId: string,
  ): Promise<{
    isFavourite: boolean;
    message: string;
  }> {
    const existing = await this.favouriteModel.findOne({
      accountId,
      componentId,
    });

    if (existing) {
      await this.favouriteModel.deleteOne({ accountId, componentId });
      return {
        isFavourite: false,
        message: 'Removed from favourites',
      };
    } else {
      await this.favouriteModel.create({ accountId, componentId });
      return {
        isFavourite: true,
        message: 'Added to favourites',
      };
    }
  }

  // Lấy tất cả favourites của user
  async getFavouritesByAccount(accountId: string): Promise<Favourite[]> {
    return this.favouriteModel
      .find({ accountId })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Kiểm tra component có trong favourites không
  async isFavourite(accountId: string, componentId: string): Promise<boolean> {
    const favourite = await this.favouriteModel.findOne({
      accountId,
      componentId,
    });
    return !!favourite;
  }

  // Lấy danh sách componentIds đã favourite
  async getFavouriteComponentIds(accountId: string): Promise<string[]> {
    const favourites = await this.favouriteModel
      .find({ accountId })
      .select('componentId')
      .exec();
    return favourites.map((f) => f.componentId);
  }

  // Đếm số lượng favourites của component
  async countFavouritesByComponent(componentId: string): Promise<number> {
    return this.favouriteModel.countDocuments({ componentId });
  }

  async findAll(): Promise<Favourite[]> {
    return this.favouriteModel.find().exec();
  }

  async findOne(id: string): Promise<Favourite | null> {
    return this.favouriteModel.findById(id).exec();
  }

  async update(
    id: string,
    updateData: Partial<any>,
  ): Promise<Favourite | null> {
    return this.favouriteModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Favourite | null> {
    return this.favouriteModel.findByIdAndDelete(id).exec();
  }
}
