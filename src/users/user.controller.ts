import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import type { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../errors/http-error.class';
import type { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import type { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import jsonwebtoken from 'jsonwebtoken';
import type { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) logger: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {
        super(logger);

        this.bindRoutes([
            {
                method: 'post',
                path: '/login',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)],
            },
            {
                method: 'post',
                path: '/register',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                method: 'get',
                path: '/info',
                func: this.info,
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    public async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfo = await this.userService.getUserInfo(user);

        this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    }

    public async login(
        { body }: Request<any, any, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.validateUser(body);

        if (!result) {
            return next(new HTTPError(401, 'Error Login', 'login'));
        }

        const jwt = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));

        this.ok(res, { jwt });
    }

    public async register(
        { body }: Request<any, any, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.createUser(body);

        if (!result) {
            return next(new HTTPError(422, 'This user already exists!', 'register'));
        }

        this.ok(res, { email: result.email, id: result.id });
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jsonwebtoken.sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(token as string);
                },
            );
        });
    }
}
