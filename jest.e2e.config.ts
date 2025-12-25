import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    // rootDir: './e2e',
    testRegex: '.e2e-spec.ts$',
};

export default config;
