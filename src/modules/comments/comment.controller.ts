import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../authenticator/jwt-auth.guard';

interface AuthRequest {
  user: { _id: string; email: string };
}

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: AuthRequest, @Body() createCommentDto: any) {
    const accountId = req.user._id;
    return await this.commentService.create({ ...createCommentDto, accountId });
  }

  @Get()
  async findAll(@Query('componentId') componentId?: string) {
    if (componentId) {
      return this.commentService.findByComponentId(componentId);
    }
    return this.commentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.commentService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
