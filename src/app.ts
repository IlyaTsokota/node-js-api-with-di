import type { Express } from 'express';
import type { Server } from 'http';

import express from 'express';
import type { UserController } from './users/user.controller';
import type { ILogger } from './logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import bodyParser from 'body-parser';
import type { IConfigService } from './config/config.service.interface';
import type { IUserController } from './users/user.controller.interface';
import type { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
    private app: Express = express();

    private port = 8000;

    private server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: IUserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    private useMiddleware(): void {
        this.app.use(bodyParser.json());
        const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    private useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    private useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    private createServer(): void {
        this.server = this.app.listen(this.port);
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.createServer();
        this.logger.log(`Server is running on http://localhost:${this.port}!`);
    }
}
