import type { Request, Response, NextFunction } from 'express';
import type { IMiddleware } from './middleware.interface';
import { ILogger } from '../logger/logger.interface';

export class AuthGuard implements IMiddleware {
    public execute(req: Request, res: Response, next: NextFunction): void {
        if (req.user) {
            return next();
        }

        res.status(401).send({ error: 'Your not authorized!' });
    }
}
