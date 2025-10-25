import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { JwtAuthGuard } from '../authenticator/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard) // Yêu cầu đăng nhập cho tất cả routes
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // GET /settings - Lấy toàn bộ settings của user hiện tại
  @Get()
  async getSettings(@Request() req) {
    const accountId = req.user.sub; // Lấy accountId từ JWT token
    return this.settingsService.getByAccountId(accountId);
  }

  // PUT /settings/profile - Cập nhật thông tin profile
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const accountId = req.user.sub;
    return this.settingsService.updateProfile(accountId, updateProfileDto);
  }

  // PUT /settings/email - Cập nhật cài đặt email/thông báo
  @Put('email')
  async updateEmailSettings(
    @Request() req,
    @Body() updateEmailSettingsDto: UpdateEmailSettingsDto,
  ) {
    const accountId = req.user.sub;
    return this.settingsService.updateEmailSettings(
      accountId,
      updateEmailSettingsDto,
    );
  }

  // GET /settings/completion - Lấy % hoàn thiện profile
  @Get('completion')
  async getProfileCompletion(@Request() req) {
    const accountId = req.user.sub;
    const completion = await this.settingsService.calculateProfileCompletion(
      accountId,
    );
    return { completion }; // Trả về { completion: 67 }
  }
}