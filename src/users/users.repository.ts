import { inject, injectable } from 'inversify';
import type { UserModel } from '../generated/prisma/client';
import type { User } from './user.entity';
import type { IUsersRepository } from './users.repository.interface';
import { TYPES } from '../types';
import type { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

    public async create({ email, name, password }: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                email,
                name,
                password,
            },
        });
    }

    public async find(email: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email: email,
            },
        });
    }
}
