module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverageFrom: ['apps/api/src/**/*.{ts,tsx}'],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/libs/common/src/$1',
    '^@auth/(.*)$': '<rootDir>/apps/api/src/auth/$1',
    '^@users/(.*)$': '<rootDir>/libs/users/$1',
    '^@lanes/(.*)$': '<rootDir>/libs/lanes/$1',
    '^@calendar/(.*)$': '<rootDir>/libs/calendar/$1',
    '^@notes/(.*)$': '<rootDir>/libs/notes/$1'
  }
};
