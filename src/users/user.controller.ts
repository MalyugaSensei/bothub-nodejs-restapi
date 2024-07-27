import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CustomRequest } from 'src/auth/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CryptoUtil } from 'src/common/utils/crypto.util';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn({
      email: loginDto.email,
      username: loginDto.username,
      password: loginDto.password,
    });
  }

  @Get('me')
  findOneMe(@Req() req: CustomRequest) {
    const user = req.user;
    return this.usersService.findOneById(+user.id);
  }

  @Public()
  @Get('confirm')
  async confirm(@Query('access') token: string) {
    const id = await CryptoUtil.decryptAES(token);
    const user = await this.usersService.confirm(+id);
    return { user };
  }

  @Put(':id/role')
  update(@Param('id') id: string, @Body() role: number) {
    return this.usersService.update(+id, role);
  }
}
