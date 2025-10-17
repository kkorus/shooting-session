module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          types: ['jest'],
          isolatedModules: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@const$': '<rootDir>/app/src/const',
  },
};
