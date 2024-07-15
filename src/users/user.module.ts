import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from 'src/users/models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),
  forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, MailerService],
  exports: [UsersService],
})
export class UsersModule { }
