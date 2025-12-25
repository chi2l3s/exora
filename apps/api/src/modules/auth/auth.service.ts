import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException(
        await this.i18n.t('errors.auth.emailExists'),
      );
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 12);

    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException(
        await this.i18n.t('errors.auth.invalidCredentials'),
      );
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        await this.i18n.t('errors.auth.invalidCredentials'),
      );
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const tokens = await this.generateTokens(payload.sub, payload.email);
      return tokens;
    } catch {
      throw new UnauthorizedException(
        await this.i18n.t('errors.auth.invalidToken'),
      );
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
