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
import { ApiOkResponse } from '@nestjs/swagger';
import { access } from 'fs';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'integer' },
      }
    }
  })
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      }
    }
  })
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn({
      email: loginDto.email,
      username: loginDto.username,
      password: loginDto.password,
    });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'integer' },
      }
    }
  })
  @Get('me')
  findOneMe(@Req() req: CustomRequest) {
    const user = req.user;
    return this.usersService.findOneById(+user.id);
  }

  @ApiOkResponse({
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'integer' },
          }
        }, {
          type: 'object',
          properties: {
            message: { type: 'string' },
          }
        }
      ]
    }
  })
  @Public()
  @Get('confirm')
  async confirm(@Query('access') token: string) {
    const id = await CryptoUtil.decryptAES(token);
    const user = await this.usersService.confirm(+id);
    return { user };
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
    }
  })
  @Put(':id/role')
  async update(@Param('id') id: string, @Body() role: number) {
    const [affectedCount, affectedRows] = await this.usersService.update(+id, role);
    return affectedRows
  }
}
