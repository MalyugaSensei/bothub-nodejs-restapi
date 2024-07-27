import { Op } from 'sequelize';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      await this.mailerService.sendUserConfirmation(user);
      return { user };
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<[User, boolean]> {
    const [user, created] = await this.userModel.findOrCreate({
      where: { username: createUserDto.username },
      defaults: createUserDto,
    });

    return [user, created];
  }

  async findOneById(id: number) {
    return await this.userModel.findByPk(id);
  }

  async findOneByUsernameOrEmail({
    username,
    email,
  }: {
    username?: string;
    email?: string;
  }): Promise<User> {
    return this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: username ? username : null },
          { email: email ? email : null },
        ],
      },
    });
  }

  update(id: number, role: number) {
    return this.userModel.update({ role }, { where: { id } });
  }

  async confirm(id: number): Promise<User | { message: string }> {
    const user = await this.userModel.findOne({
      where: {
        id,
        confirmed: false,
      },
    });

    if (!user) {
      return {
        message: 'User already confirmed',
      };
    }

    user.confirmed = true;
    await user.save();

    return user;
  }
}
