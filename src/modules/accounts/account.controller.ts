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
import { AccountService } from './account.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../authenticator/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user?: { _id: string; email: string; role: string };
}

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 🟢 CREATE
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.accountService.create(createUserDto);
  }

  // 🟢 READ ALL
  @Get()
  async findAll() {
    return this.accountService.findAll();
  }

  // 🟢 READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  // 🟡 UPDATE
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    return this.accountService.update(id, updateData);
  }

  // 🔴 DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }

  // 🧩 NEW: Get current logged-in user profile
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    const account = await this.accountService.findById(req.user!._id);
    if (!account) return { message: 'Account not found' };

    return {
      _id: account._id,
      email: account.email,
      userName: account.userName,
      avatar: account.avatar,
      role: account.role,
    };
  }
}
