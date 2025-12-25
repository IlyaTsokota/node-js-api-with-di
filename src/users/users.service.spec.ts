import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

let container: Container;
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
    container = new Container();
    container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
    usersService = container.get<IUsersService>(TYPES.UsersService);
});

describe('createUser', () => {
    it('success', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce((user: User) => ({
            id: 1,
            email: user.email,
            name: user.name,
            password: user.password,
        }));

        const createdUser = await usersService.createUser({
            email: 'a@a.com',
            name: 'User',
            password: 'qwerty123',
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('qwerty123');
    });
});

describe('validateUser', () => {
    beforeAll(() => {
        usersRepository.find = jest.fn().mockResolvedValueOnce({
            email: 'a@a.com',
            name: 'User',
            password: 'qwerty123',
        });
    });

    it('correct password', async () => {
        jest.spyOn(User.prototype, 'comparePassword').mockResolvedValue(true);

        const isValid = await usersService.validateUser({
            email: 'a@a.com',
            password: 'qwerty123',
        });

        expect(isValid).toBeTruthy();
    });

    it('wrong password', async () => {
        const isValid = await usersService.validateUser({
            email: 'a@a.com',
            password: '1',
        });

        expect(isValid).toBeFalsy();
    });

    it('wrong user', async () => {
        usersRepository.find = jest.fn().mockResolvedValueOnce(null);

        const isValid = await usersService.validateUser({
            email: 'a@a.com',
            password: 'qwerty123',
        });

        expect(isValid).toBeFalsy();
    });
});
