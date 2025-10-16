import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  //UseGuards,
  //Request
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';

// Uncomment nếu bạn có JWT Guard
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favourites')
// @UseGuards(JwtAuthGuard) // Uncomment khi có authentication
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  // Toggle favourite (thêm/xóa)
  @Post('toggle')
  async toggleFavourite(
    @Body() body: { accountId: string; componentId: string }
  ) {
    return this.favouriteService.toggleFavourite(body.accountId, body.componentId);
  }

  // Thêm vào favourites
  @Post()
  async addToFavourites(
    @Body() body: { accountId: string; componentId: string }
  ) {
    return this.favouriteService.addToFavourites(body.accountId, body.componentId);
  }

  // Xóa khỏi favourites
  @Delete()
  async removeFromFavourites(
    @Body() body: { accountId: string; componentId: string }
  ) {
    await this.favouriteService.removeFromFavourites(body.accountId, body.componentId);
    return { message: 'Removed from favourites successfully' };
  }

  // Lấy tất cả favourites của user
  @Get('account/:accountId')
  async getFavouritesByAccount(@Param('accountId') accountId: string) {
    return this.favouriteService.getFavouritesByAccount(accountId);
  }

  // Kiểm tra component có trong favourites không
  @Get('check/:accountId/:componentId')
  async checkIsFavourite(
    @Param('accountId') accountId: string,
    @Param('componentId') componentId: string
  ) {
    const isFavourite = await this.favouriteService.isFavourite(accountId, componentId);
    return { isFavourite };
  }

  // Lấy danh sách componentIds đã favourite
  @Get('components/:accountId')
  async getFavouriteComponentIds(@Param('accountId') accountId: string) {
    const componentIds = await this.favouriteService.getFavouriteComponentIds(accountId);
    return { componentIds };
  }

  // Đếm số favourites của component
  @Get('count/:componentId')
  async countFavourites(@Param('componentId') componentId: string) {
    const count = await this.favouriteService.countFavouritesByComponent(componentId);
    return { count };
  }

  @Get()
  findAll() {
    return this.favouriteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favouriteService.findOne(id);
  }
}
