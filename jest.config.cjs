module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverageFrom: ['apps/api/src/**/*.{ts,tsx}'],
  moduleNameMapper: { '^@common/(.*)$': '<rootDir>/libs/common/src/$1' }
};
