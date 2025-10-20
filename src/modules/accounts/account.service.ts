import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Account, AccountDocument } from './account.schema';
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
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async findAll(): Promise<HydratedDocument<Account>[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<HydratedDocument<Account> | null> {
    return this.accountModel.findById(id).exec();
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<HydratedDocument<Account>> {
    const createdUser = new this.accountModel(createUserDto);
    return createdUser.save();
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<HydratedDocument<Account> | null> {
    return this.accountModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<HydratedDocument<Account> | null> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }

  async findOrCreateAccount(
    profile: ProviderProfile,
  ): Promise<HydratedDocument<Account>> {
    const { email, userName, avatar, provider, providerId } = profile;
    const existing = await this.accountModel
      .findOne({ providerId, provider })
      .exec();

    if (existing) {
      existing.userName = userName;
      if (avatar) existing.avatar = avatar;
      return existing.save();
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
