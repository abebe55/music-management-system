import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/database/seed.ts',
  ],
  testTimeout: 60000,
  // Set NODE_ENV=test so services skip real external calls (email, etc.)
  testEnvironmentOptions: {},
  globalSetup: undefined,
  setupFiles: ['<rootDir>/tests/helpers/jest.env.ts'],
  // ts-jest config
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          strict: false,
          esModuleInterop: true,
        },
      },
    ],
  },
};

export default config;
