import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ViewService } from './view.service';

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
}
