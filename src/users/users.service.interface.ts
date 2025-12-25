import type { UserModel } from '../generated/prisma/client';
import type { UserLoginDto } from './dto/user-login.dto';
import type { UserRegisterDto } from './dto/user-register.dto';

export interface IUsersService {
    createUser(dto: UserRegisterDto): Promise<UserModel | null>;
    validateUser(dto: UserLoginDto): Promise<boolean>;
    getUserInfo(email: string): Promise<UserModel | null>;
}
