import { inject, injectable } from 'inversify';
import type { UserLoginDto } from './dto/user-login.dto';
import type { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import type { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import type { IConfigService } from '../config/config.service.interface';
import type { IUsersRepository } from './users.repository.interface';
import type { UserModel } from '../generated/prisma/client';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
    ) {}

    public async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const existedUser = await this.usersRepository.find(email);
        if (existedUser) {
            return null;
        }

        const newUser = new User(email, name);
        const salt = this.configService.get('PASSWORD_SALT');
        await newUser.setPassword(password, parseInt(salt));

        return this.usersRepository.create(newUser);
    }

    public async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existedUser = await this.usersRepository.find(email);
        if (!existedUser) {
            return false;
        }

        const user = new User(existedUser.email, existedUser.name, existedUser.password);

        return user.comparePassword(password);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }
}
