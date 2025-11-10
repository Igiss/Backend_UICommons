import { IsString, IsOptional } from 'class-validator';

// DTO cập nhật thông tin profile cá nhân
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string; // Tên hiển thị

  @IsOptional()
  @IsString()
  bio?: string; // Tiểu sử ngắn gọn
}