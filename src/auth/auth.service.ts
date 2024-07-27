import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/user.service';
import { CryptoUtil } from 'src/common/utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const hashPass = await CryptoUtil.hashPassword(createUserDto.password);

    const [user, created] = await this.userService.create({
      ...createUserDto,
      password: hashPass,
      role: 0,
    });

    if (!created) {
      throw new BadRequestException('User already exists');
    }

    return user;
  }

  async signIn({ username, email, password }: LoginDto): Promise<any> {
    const user = await this.userService.findOneByUsernameOrEmail({
      username,
      email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isVerifyed = await CryptoUtil.comparePassword(
      password,
      user.password,
    );

    if (!isVerifyed) {
      throw new UnauthorizedException();
    }

    if (!user.confirmed) {
      throw new ForbiddenException('Please confirm your email');
    }

    const payload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    };
    return {
      access_token: this.generateJWT(payload),
    };
  }

  generateJWT(payload: { sub: any;[key: string]: string | number }): string {
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
