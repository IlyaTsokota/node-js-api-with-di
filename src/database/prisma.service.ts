import { inject, injectable } from 'inversify';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import type { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import type { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
    public client: PrismaClient;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {
        const adapter = new PrismaBetterSqlite3({ url: configService.get('DATABASE_URL') });
        this.client = new PrismaClient({ adapter });
    }

    public async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] Connected!');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error('[PrismaService] Failed to connected: ' + e.message);
            }
        }
    }

    public async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
