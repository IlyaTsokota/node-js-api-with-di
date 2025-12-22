import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import type { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../errors/http-error.class.js';
import type { IUserController } from './user.controller.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);

		this.bindRoutes([
			{ method: 'post', path: '/login', func: this.login },
			{ method: 'post', path: '/register', func: this.register },
		]);
	}

	public login = (req: Request, res: Response, next: NextFunction): void => {
		next(new HTTPError(500, 'Error Login'));
	};

	public register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Register');
	}
}
