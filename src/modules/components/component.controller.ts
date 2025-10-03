import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ComponentService } from './component.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentDto } from './dto/create-component.dto';

@ApiTags('components')
@Controller('components') // endpoint = /components
export class ComponentsController {
  constructor(private readonly componentsService: ComponentService) {}

  // 🟢 Tạo component mới

  @Post()
  async create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  // 🟡 Lấy tất cả component
  @Get()
  async findAll() {
    return await this.componentsService.findAll();
  }

  // 🟡 Lấy 1 component theo ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.componentsService.findOne(id);
  }

  // 🔵 Cập nhật component theo ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateComponentDto: any) {
    return await this.componentsService.update(id, updateComponentDto);
  }

  // 🔴 Xóa component theo ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // trả về 204 khi xóa thành công
  async remove(@Param('id') id: string) {
    return await this.componentsService.remove(id);
  }
}
