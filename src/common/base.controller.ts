import type { RequestHandler, Response } from 'express';

import { Router } from 'express';
import type { ExpressReturnType, IControllerRoute } from './route.interface';
import type { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
    protected readonly _router: Router;

    constructor(protected logger: ILogger) {
        this._router = Router();
    }

    public get router(): Router {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T): ExpressReturnType {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T): ExpressReturnType {
        return this.send<T>(res, 200, message);
    }

    public created(res: Response): ExpressReturnType {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]): void {
        routes.forEach((route) => {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middleware = route.middlewares?.map((m) => m.execute.bind(m));
            const handler = route.func.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;
            this.router[route.method](route.path, pipeline);
        });
    }
}
