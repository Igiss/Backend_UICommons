import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings } from './settings.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<Settings>,
  ) {}

  // Lấy hoặc tạo mới settings cho account (tự động tạo nếu chưa có)
  async getOrCreate(accountId: string): Promise<Settings> {
    let settings = await this.settingsModel.findOne({ accountId }).exec();
    settings ??= await this.settingsModel.create({ accountId });

    return settings;
  }

  // Lấy settings theo accountId
  async getByAccountId(accountId: string): Promise<Settings> {
    return this.getOrCreate(accountId);
  }

  // Cập nhật thông tin profile
  async updateProfile(
    accountId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Settings> {
    const settings = await this.settingsModel
      .findOneAndUpdate(
        { accountId },
        { $set: updateProfileDto }, // Chỉ update các field được gửi lên
        { new: true, upsert: true }, // new: trả về document sau update, upsert: tạo mới nếu chưa có
      )
      .exec();

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  // Cập nhật cài đặt email và thông báo
  async updateEmailSettings(
    accountId: string,
    updateEmailSettingsDto: UpdateEmailSettingsDto,
  ): Promise<Settings> {
    const settings = await this.settingsModel
      .findOneAndUpdate(
        { accountId },
        { $set: updateEmailSettingsDto },
        { new: true, upsert: true },
      )
      .exec();

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return settings;
  }

  // Tính % hoàn thiện profile (dựa trên các field đã điền)
  async calculateProfileCompletion(accountId: string): Promise<number> {
    const settings = await this.getByAccountId(accountId);
    
    const fields = [
      settings.name,
      settings.location,
      settings.company,
      settings.twitter,
      settings.website,
      settings.bio,
    ];

    // Đếm số field đã điền (không rỗng)
    const filledFields = fields.filter((field) => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }

  // Xóa settings khi xóa account
  async deleteByAccountId(accountId: string): Promise<void> {
    await this.settingsModel.deleteOne({ accountId }).exec();
  }
}