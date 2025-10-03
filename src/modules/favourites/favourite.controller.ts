import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';

@Controller('favourites')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}
  @Post()
  async create(@Body() createFavouriteDto: any) {
    return await this.favouriteService.create(createFavouriteDto);
  }
  @Get()
  async findAll() {
    return this.favouriteService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.favouriteService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.favouriteService.update(id, updateData);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favouriteService.remove(id);
  }
}
