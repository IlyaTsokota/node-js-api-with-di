import type { NextFunction, Request, Response } from 'express';
import type { IExceptionFilter } from './exception.filter.interface.js';
import { HTTPError } from './http-error.class.js';
import { inject, injectable } from 'inversify';
import type { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Failed ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
