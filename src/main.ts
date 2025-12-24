import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import type { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import type { IUserController } from './users/user.controller.interface';
import type { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import type { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import type { IUsersRepository } from './users/users.repository.interface';

export const appBindings = new ContainerModule(({ bind }) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
    bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
    bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App).inSingletonScope();
});

type Bootstrap = { app: App; appContainer: Container };

function bootstrap(): Bootstrap {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();

    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
