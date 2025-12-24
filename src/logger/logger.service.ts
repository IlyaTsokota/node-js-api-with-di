import { Logger, type ILogObj } from 'tslog';
import type { ILogger } from './logger.interface';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger<ILogObj>;

    constructor() {
        this.logger = new Logger();
    }

    public log(...args: unknown[]): void {
        this.logger.info(...args);
    }

    public error(...args: unknown[]): void {
        this.logger.error(...args);
    }

    public warn(...args: any[]): void {
        this.logger.warn(...args);
    }
}
