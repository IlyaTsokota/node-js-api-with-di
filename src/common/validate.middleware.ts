import type { Request, Response, NextFunction } from 'express';
import type { IMiddleware } from './middleware.interface';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    public execute({ body }: Request, res: Response, next: NextFunction): void {
        const instance = plainToInstance(this.classToValidate, body);

        validate(instance).then((errors) => {
            if (errors.length) {
                res.status(422).send(errors);
            } else {
                next();
            }
        });
    }
}
