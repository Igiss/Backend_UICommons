import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../accounts/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  // Lấy settings từ account
  async getByAccountId(accountId: string): Promise<any> {
    console.log('Fetching account with ID:', accountId);
    
    const account = await this.accountModel.findById(accountId).exec();
    
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    
    // Return data với default values nếu field không tồn tại
    return {
      _id: account._id,
      userName: account.userName || '',
      bio: account.bio || '',
      email: account.email,
      avatar: account.avatar || '',
      emailNotifications: account.emailNotifications ?? true,
      notificationPreferences: account.notificationPreferences || {
        postReviews: true,
        comments: true,
        newChallenges: true,
        socialMedia: true,
      },
    };
  }

  // Cập nhật thông tin profile (chỉ userName và bio)
  async updateProfile(
    accountId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<AccountDocument> {
    console.log('Updating profile for account:', accountId, updateProfileDto);
    
    const account = await this.accountModel
      .findByIdAndUpdate(
        accountId,
        { $set: updateProfileDto },
        { new: true },
      )
      .exec();

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    return account;
  }

  // Cập nhật cài đặt email và thông báo
  async updateEmailSettings(
    accountId: string,
    updateEmailSettingsDto: UpdateEmailSettingsDto,
  ): Promise<AccountDocument> {
    console.log('Updating email settings for account:', accountId, updateEmailSettingsDto);
    
    const account = await this.accountModel
      .findByIdAndUpdate(
        accountId,
        { $set: updateEmailSettingsDto },
        { new: true },
      )
      .exec();

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    return account;
  }

  // Tính % hoàn thiện profile
  async calculateProfileCompletion(accountId: string): Promise<number> {
    const data = await this.getByAccountId(accountId);
    
    const fields = [
      data.userName,
      data.bio,
    ];

    const filledFields = fields.filter((field) => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }
}