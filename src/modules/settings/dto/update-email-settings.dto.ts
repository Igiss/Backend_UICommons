import { IsBoolean, IsOptional, IsObject } from 'class-validator';

// DTO để cập nhật cài đặt email và thông báo
export class UpdateEmailSettingsDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean; // Bật/tắt nhận email thông báo

  @IsOptional()
  @IsObject()
  notificationPreferences?: { // Tùy chỉnh từng loại thông báo
    postReviews?: boolean;      // Thông báo khi post được review
    comments?: boolean;          // Thông báo khi có comment mới
    newChallenges?: boolean;     // Thông báo về challenges mới
    socialMedia?: boolean;       // Thông báo khi chia sẻ social media
  };
}