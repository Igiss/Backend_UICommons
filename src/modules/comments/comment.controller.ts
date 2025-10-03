import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 🟢 CREATE
  @Post()
  async create(@Body() createCommentDto: any) {
    return await this.commentService.create(createCommentDto);
  }

  @Get()
  async findAll() {
    return this.commentService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.commentService.update(id, updateData);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
