import { config, type DotenvConfigOutput, type DotenvParseOutput } from 'dotenv';
import type { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import type { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();

        if (result.error) {
            this.logger.error('[ConfigService] The file ".env" could not be read or is missing!');
        } else {
            this.logger.log('[ConfigService] Config .env parsed!');
            this.config = result.parsed as DotenvParseOutput;
        }
    }

    public get(key: string): string {
        return this.config[key] as string;
    }
}
