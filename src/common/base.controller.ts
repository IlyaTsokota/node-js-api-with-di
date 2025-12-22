import type { Response } from 'express';

import { Router } from 'express';
import type { IControllerRoute } from './controllerRoute.interface.js';
import type { ILogger } from '../logger/logger.interface.js';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	public get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Record<string, any> {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): void {
		this.send<T>(res, 200, message);
	}

	public created(res: Response): void {
		res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);

			const handler = route.func.bind(this);

			this.router[route.method](route.path, handler);
		});
	}
}
