import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthService } from './auth.service';
import { User } from 'src/users/models/user.model';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule, forwardRef(() => UsersModule)],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
