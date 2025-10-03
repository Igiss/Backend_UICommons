// src/modules/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}
