import type { UserModel } from '../generated/prisma/client';
import type { User } from './user.entity';

export interface IUsersRepository {
    create(user: User): Promise<UserModel>;
    find(email: string): Promise<UserModel | null>;
}
