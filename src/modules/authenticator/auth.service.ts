import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../accounts/account.service';

interface ProviderProfile {
  email: string;
  userName: string;
  avatar?: string;
  provider: string;
  providerId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async loginWithProvider(
    profile: ProviderProfile,
  ): Promise<{ access_token: string }> {
    const account = await this.accountService.findOrCreateAccount(profile);

    if (!account) {
      throw new Error('Account not found or created');
    }

    console.log('=== LOGIN WITH PROVIDER ===');
    console.log('account._id:', account._id);
    console.log('account._id type:', typeof account._id);
    console.log('account.email:', account.email);

    // Convert _id sang string để chắc chắn
    const accountId = account._id.toString();

    const payload = { sub: accountId, email: account.email };

    console.log('=== JWT PAYLOAD ===');
    console.log('payload:', JSON.stringify(payload, null, 2));

    const token = this.jwtService.sign(payload);

    console.log('=== GENERATED TOKEN ===');
    console.log('token:', token);

    return { access_token: token };
  }
}
