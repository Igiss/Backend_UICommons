import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/authenticator/auth.module'; // 1. Import AuthModule
import { ComponentModule } from './modules/components/component.module';
import { FavouriteModule } from './modules/favourites/favourite.module';

@Module({
  imports: [
    // 2. Thêm ConfigModule để đọc file .env trên toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Chỉ định file env
    }),

    // Cấu hình Mongoose một cách linh hoạt hơn
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Lấy chuỗi kết nối từ .env
      }),
    }),

    FavouriteModule,
    AccountModule,
    ComponentModule,
    AuthModule,
  ],
})
export class AppModule {}
