import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/account.schema';

// ✅ BƯỚC 1: Định nghĩa một Interface rõ ràng cho profile từ Google
// Điều này giúp ESLint hiểu chính xác cấu trúc dữ liệu chúng ta mong đợi
interface IGithubProfile {
  id: string;
  displayName: string;
  emails?: { value: string; verified: boolean }[];
  photos?: { value: string }[];
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly accountService: AccountService) {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackURL = process.env.GITHUB_CALLBACK_URL;

    // Để bảo mật, chúng ta chỉ kiểm tra xem secret có tồn tại hay không
    console.log(
      'GITHUB_CLIENT_SECRET being used: ',
      clientSecret ? 'Exists (********)' : undefined,
    );
    console.log('GITHUB_CALLBACK_URL being used:', callbackURL);
    console.log('===================================');
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Github OAuth environment variables');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    // Giữ nguyên `Profile` ở đây để tương thích với thư viện
    profile: Profile,
  ): Promise<Account> {
    console.log(
      '--- RAW Github PROFILE RECEIVED ---',
      JSON.stringify(profile, null, 2),
    );
    // ✅ BƯỚC 2: Sử dụng ép kiểu (Type Assertion) với Interface đã tạo
    // Bằng cách này, chúng ta nói với TypeScript: "Hãy tin tôi, tôi biết profile có dạng IGoogleProfile"
    const { id, displayName, emails, photos } = profile as IGithubProfile;

    const email = emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Github account does not have an email.');
    }

    const userProfile = {
      email,
      userName: displayName ?? 'Github User',
      avatar: photos?.[0]?.value ?? '',
      provider: 'github',
      providerId: id,
    };

    const account = await this.accountService.findOrCreateAccount(userProfile);

    if (!account) {
      throw new UnauthorizedException(
        'Could not process Github authentication.',
      );
    }

    return account;
  }
}
