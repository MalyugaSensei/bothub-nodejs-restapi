import { Controller, Get, Post, Body, Param, Put, Req, Query, UseGuards, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CustomRequest } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from 'src/mailer/mailer.service';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,

  ) { }

  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      await this.mailerService.sendUserConfirmation(user);
      return { user };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn({
      email: loginDto.email,
      username: loginDto.username,
      password: loginDto.password
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
    const id = await this.mailerService.decryptAES(token)
    const user = await this.usersService.confirm(+id);
    return { user };
  }

  @Put(':id/role')
  update(@Param('id') id: string, @Body() role: string) {
    return this.usersService.update(+id, role);
  }
}
