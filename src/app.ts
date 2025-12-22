import type { Express } from 'express';
import type { Server } from 'http';

import express from 'express';
import type { UserController } from './users/user.controller.js';
import type { ILogger } from './logger/logger.interface.js';
import { injectable, inject } from 'inversify';
import { TYPES } from './types.js';
import type { IExceptionFilter } from './errors/exception.filter.interface.js';

@injectable()
export class App {
	private app: Express = express();

	private port = 8000;

	private server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private UserController: UserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {}

	private useRoutes(): void {
		this.app.use('/users', this.UserController.router);
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	private createServer(): void {
		this.server = this.app.listen(this.port);
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExceptionFilters();
		this.createServer();
		this.logger.log(`Server is running on http://localhost:${this.port}!`);
	}
}
