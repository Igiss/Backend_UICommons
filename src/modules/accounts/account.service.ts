import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './account.schema';

// Interface cho Provider Profile (từ OAuth)
interface ProviderProfile {
  userName: string;
  provider: string;
  providerId: string;
  email: string;
  avatar?: string;
}

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  // Lấy tất cả accounts
  async findAll(): Promise<AccountDocument[]> {
    return this.accountModel.find().exec();
  }

  // Tìm account theo ID (alias cho findById)
  async findOne(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).exec();
  }

  // Tìm account theo ID
  async findById(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).exec();
  }

  // Tạo account mới
  async create(createAccountDto: any): Promise<AccountDocument> {
    const createdUser = new this.accountModel(createAccountDto);
    return createdUser.save();
  }

  // Cập nhật account
  async update(id: string, updateAccountDto: any): Promise<AccountDocument | null> {
    return this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();
  }

  // Xóa account
  async remove(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }

  // Tìm account theo username
  async findByUsername(username: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ username }).exec();
  }

  // Tìm account theo email
  async findByEmail(email: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ email }).exec();
  }

  // Tìm hoặc tạo account từ provider (OAuth) - Method mới
  async findOrCreateAccount(profile: ProviderProfile): Promise<AccountDocument> {
    const { providerId, provider, userName, email, avatar } = profile;

    // Tìm account đã tồn tại theo providerId và provider
    const existing = await this.accountModel.findOne({ providerId, provider }).exec();

    if (existing) {
      // Cập nhật thông tin nếu đã tồn tại
      existing.userName = userName;
      if (avatar) existing.avatar = avatar;
      return existing.save();
    }

    // Tạo account mới nếu chưa tồn tại
    const newAccount = new this.accountModel({
      providerId,
      provider,
      userName,
      username: userName, // Dùng userName làm username mặc định
      email,
      password: 'oauth_provider', // Password giả cho OAuth users
      avatar,
    });

    return newAccount.save();
  }

  // Tìm hoặc tạo account từ provider (alias cũ - giữ lại để tương thích)
  async findOrCreateFromProvider(
    providerId: string,
    provider: string,
    userName: string,
    email: string,
    avatar?: string,
  ): Promise<AccountDocument> {
    return this.findOrCreateAccount({
      providerId,
      provider,
      userName,
      email,
      avatar,
    });
  }
}
