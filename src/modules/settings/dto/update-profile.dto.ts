import { IsString, IsOptional } from 'class-validator';

// DTO cập nhật thông tin profile cá nhân
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  userName?: string; // Đổi từ name -> userName

  @IsOptional()
  @IsString()
  bio?: string; // Tiểu sử ngắn gọn
}