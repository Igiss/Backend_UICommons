import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favourite } from './favourite.schema';

export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name)
    private readonly favouriteModel: Model<Favourite>,
  ) {}
  async create(createFavouriteDto: any): Promise<Favourite> {
    const createdFavourite = new this.favouriteModel(createFavouriteDto);
    return createdFavourite.save();
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
