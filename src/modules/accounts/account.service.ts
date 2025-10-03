import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './account.schema';
import { CreateUserDto } from './dto/create-user.dto';

interface ProviderProfile {
  email: string;
  userName: string;
  avatar?: string;
  provider: string;
  providerId: string;
}
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account | null> {
    return this.accountModel.findById(id).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<Account> {
    const createdUser = new this.accountModel(createUserDto);
    return createdUser.save();
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<Account | null> {
    return this.accountModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Account | null> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }
  async findOrCreateAccount(profile: ProviderProfile): Promise<Account> {
    const { email, userName, avatar, provider, providerId } = profile;
    const Account = await this.accountModel
      .findOne({ providerId, provider })
      .exec();
    if (Account) {
      Account.userName = userName;
      if (avatar) {
        Account.avatar = avatar;
      }
      return Account.save();
    }

    const newAccount = new this.accountModel({
      email,
      userName,
      avatar,
      provider,
      providerId,
    });
    return newAccount.save();
  }
}
