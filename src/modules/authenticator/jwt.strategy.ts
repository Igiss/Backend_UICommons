import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AccountService } from '../accounts/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // Sau khi token hợp lệ, payload sẽ được truyền vào hàm này
  async validate(payload: { sub: string; email: string }) {
    // Bạn có thể tìm user trong DB từ payload.sub (là _id của account)
    const user = await this.accountService.findOne(payload.sub);
    // Kết quả trả về sẽ được gắn vào req.user
    return user;
  }
}
