import type { Request, Response, NextFunction } from 'express';
import type { IMiddleware } from './middleware.interface';
import jsonwebtoken from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    public execute(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next();
        }

        const [, token] = authHeader.split(' ');

        if (token === undefined) {
            return next();
        }

        jsonwebtoken.verify(token, this.secret, (err, payload) => {
            if (err) {
                return next();
            } else if (payload && typeof payload !== 'string') {
                req.user = payload.email;
            }

            return next();
        });
    }
}
