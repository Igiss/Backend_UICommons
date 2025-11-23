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
  UnauthorizedException,
} from '@nestjs/common';
import { ComponentService, AggregatedComponent } from './component.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentDto } from './dto/create-component.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AdminGuard } from '../authenticator/admin.guard';

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

    if (!accountId) {
      throw new UnauthorizedException('User not found');
    }

    const categoryId = dto.categoryId ?? 'default-ui';
    return await this.componentsService.create({
      ...dto,
      accountId,
      categoryId,
    });
  }

  @Get()
  async findAll(): Promise<AggregatedComponent[]> {
    return await this.componentsService.findAll();
  }

  @Get('user/:tab')
  @UseGuards(AuthGuard('jwt'))
  async getUserComponents(
    @Req() req: AuthenticatedRequest,
    @Param('tab') tab: string,
  ) {
    const accountId = req.user?._id;
    if (!accountId) {
      throw new UnauthorizedException('User not found');
    }
    return await this.componentsService.findByUserAndStatus(accountId, tab);
  }
  @UseGuards(AdminGuard)
  @Get('review')
  async getReviewComponents() {
    console.log('📥 GET /components/review');
    const items = await this.componentsService.findByStatus('review');
    console.log('📦 Found review items:', items?.length);
    return Array.isArray(items) ? items : [];
  }
  @Get(':id/with-stats')
  async findOneWithStats(@Param('id') id: string): Promise<any> {
    return await this.componentsService.findOneWithStats(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.componentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComponentDto: Partial<CreateComponentDto>,
  ) {
    return await this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.componentsService.remove(id);
  }
  @UseGuards(AdminGuard)
  @Put(':id/approve')
  async approveComponent(@Param('id') id: string) {
    return await this.componentsService.update(id, { status: 'public' });
  }

  @UseGuards(AdminGuard)
  @Put(':id/reject')
  async rejectComponent(@Param('id') id: string) {
    return await this.componentsService.update(id, { status: 'rejected' });
  }
}
