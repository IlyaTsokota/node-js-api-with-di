import { Container, ContainerModule } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import type { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import type { IUsersController } from './users/users.controller.interface';
import type { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import type { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import type { IUsersRepository } from './users/users.repository.interface';

export const appBindings = new ContainerModule(({ bind }) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
    bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
    bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App).inSingletonScope();
});

type BootstrapReturn = { app: App; appContainer: Container };

async function bootstrap(): Promise<BootstrapReturn> {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    await app.init();

    return { app, appContainer };
}

export const boot = bootstrap();
