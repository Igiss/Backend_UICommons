import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ProfileController } from './profile.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountController, ProfileController], // ✅ đúng
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
