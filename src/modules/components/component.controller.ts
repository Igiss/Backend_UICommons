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
UseGuards,
  Req,
} from '@nestjs/common';
import { ComponentService } from './component.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentDto } from './dto/create-component.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { _id: string; email?: string };
}

@ApiTags('components')
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateComponentDto,
  ) {
    const accountId = req.user?._id;
    const categoryId = dto.categoryId ?? 'default-ui';
    return this.componentsService.create({ ...dto, accountId, categoryId });
  }

  @Get()
  async findAll() {
    return this.componentsService.findAll();
  }

  @Get('user/:tab')
  @UseGuards(AuthGuard('jwt'))
  async getUserComponents(@Req() req, @Param('tab') tab: string) {
    const accountId = req.user._id;
    return this.componentsService.findByUserAndStatus(accountId, tab);
  }
  
  @Get(':id/with-stats')
  async findOneWithStats(@Param('id') id: string) {
    return this.componentsService.findOneWithStats(id);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.componentsService.findOne(id);
  }
  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComponentDto: Partial<CreateComponentDto>,
  ) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }


}
