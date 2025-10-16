import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/authenticator/auth.module';
import { ComponentModule } from './modules/components/component.module';
import { FavouriteModule } from './modules/favourites/favourite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/uicommons'
    ),
    AccountModule,
    ComponentModule,
    AuthModule,
    FavouriteModule,
  ],
})
export class AppModule {}
