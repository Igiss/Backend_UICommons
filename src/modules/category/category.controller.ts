import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST /categories
  @Post()
  async create(@Body() body: Partial<Category>): Promise<Category> {
    return this.categoryService.create(body);
  }

  // GET /categories
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  // GET /categories/:id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  // PUT /categories/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Category>,
  ): Promise<Category> {
    return this.categoryService.update(id, body);
  }

  // DELETE /categories/:id
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.categoryService.remove(id);
    return { message: `Category ${id} deleted successfully` };
  }
}
