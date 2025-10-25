import { IsString, IsOptional, IsUrl } from 'class-validator';

// DTO cập nhật thông tin profile cá nhân
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string; // Tên hiển thị

  @IsOptional()
  @IsString()
  location?: string; // Vị trí địa lý

  @IsOptional()
  @IsString()
  company?: string; // Công ty đang làm việc

  @IsOptional()
  @IsString()
  twitter?: string; // Twitter handle (không cần @)

  @IsOptional()
  @IsUrl()
  website?: string; // Website cá nhân

  @IsOptional()
  @IsString()
  bio?: string; // Tiểu sử ngắn gọn
}