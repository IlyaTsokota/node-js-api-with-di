import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import type { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../errors/http-error.class.js';

export interface IUserController {
	login(req: Request, res: Response, next: NextFunction): void;
	register(req: Request, res: Response, next: NextFunction): void;
}
