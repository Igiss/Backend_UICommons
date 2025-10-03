// File: src/modules/accounts/profile.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountDocument } from './account.schema';

interface AuthenticatedRequest {
  user: AccountDocument;
}

@Controller('profile')
export class ProfileController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    // ✅ SỬA LỖI: Dùng destructuring để tách 'password' ra khỏi object.
    // Dòng này sẽ tạo ra một biến 'password' (mà chúng ta không dùng)
    // và một object mới 'userProfile' chứa TẤT CẢ các thuộc tính còn lại.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfile } = req.user.toObject();

    return userProfile;
  }
}
