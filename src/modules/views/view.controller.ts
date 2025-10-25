import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ViewService } from './view.service';
import { JwtAuthGuard } from '../authenticator/jwt-auth.guard';

// ✅ Định nghĩa rõ kiểu JwtRequest
interface JwtRequest extends Request {
  user: { _id: string; email: string };
}

@Controller('views')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Post()
  async create(@Body() createViewDto: any) {
    return await this.viewService.create(createViewDto);
  }

  @Get()
  async findAll() {
    return await this.viewService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.viewService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return await this.viewService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.viewService.remove(id);
  }

  // ✅ Ghi lại lượt xem (có JWT)
  @Post('record/:componentId')
  @UseGuards(JwtAuthGuard)
  async recordView(
    @Req() req: JwtRequest,
    @Param('componentId') componentId: string,
  ) {
    const accountId = req.user?._id; // thêm ? để tránh lỗi ESLint
    if (!accountId) {
      return { success: false, message: 'Unauthorized user' };
    }

    await this.viewService.recordView(componentId, accountId);
    return { success: true };
  }
}
