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
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Request() req) {
    try {
      console.log('=== FULL REQ.USER ===');
      console.log(JSON.stringify(req.user, null, 2));
      console.log('req.user.sub:', req.user.sub);
      console.log('req.user._id:', req.user._id);
      console.log('req.user.id:', req.user.id);
      
      const accountId = req.user.sub || req.user._id || req.user.id;
      
      if (!accountId) {
        throw new Error('Account ID not found in JWT token');
      }
      
      return await this.settingsService.getByAccountId(accountId);
    } catch (error) {
      console.error('Error in getSettings:', error);
      throw error;
    }
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      console.log('=== UPDATE PROFILE - REQ.USER ===');
      console.log(JSON.stringify(req.user, null, 2));
      
      const accountId = req.user.sub || req.user._id || req.user.id;
      
      if (!accountId) {
        throw new Error('Account ID not found in JWT token');
      }
      
      return await this.settingsService.updateProfile(accountId, updateProfileDto);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  @Put('email')
  async updateEmailSettings(
    @Request() req,
    @Body() updateEmailSettingsDto: UpdateEmailSettingsDto,
  ) {
    try {
      const accountId = req.user.sub || req.user._id || req.user.id;
      
      if (!accountId) {
        throw new Error('Account ID not found in JWT token');
      }
      
      return await this.settingsService.updateEmailSettings(
        accountId,
        updateEmailSettingsDto,
      );
    } catch (error) {
      console.error('Error in updateEmailSettings:', error);
      throw error;
    }
  }

  @Get('completion')
  async getProfileCompletion(@Request() req) {
    try {
      const accountId = req.user.sub || req.user._id || req.user.id;
      
      if (!accountId) {
        throw new Error('Account ID not found in JWT token');
      }
      
      const completion = await this.settingsService.calculateProfileCompletion(
        accountId,
      );
      return { completion };
    } catch (error) {
      console.error('Error in getProfileCompletion:', error);
      throw error;
    }
  }
}