import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/models/user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<[User, boolean]> {
        const [user, created] = await this.userModel.findOrCreate({
            where: { username: createUserDto.username }, defaults: createUserDto
        });

        return [user, created]
    }

    findAll() {
        return `This action returns all users`;
    }

    async findOneById(id: number) {
        return await this.userModel.findByPk(id)
    }

    async findOneByUsernameOrEmail({ username, email }: { username?: string, email?: string }): Promise<User> {
        return this.userModel.findOne({
            where: {
                [Op.or]: [
                    { username: username ? username : null },
                    { email: email ? email : null }
                ]
            }
        });
    }

    update(id: number, role: string) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async confirm(id: number): Promise<User | { message: string }> {
        const user = await this.userModel.findOne({
            where: {
                id,
                confirmed: false
            }
        })

        if (!user) {
            return {
                message: "User already confirmed"
            }
        }
        console.log(user)
        user.confirmed = true
        await user.save()

        return user
    }
}
