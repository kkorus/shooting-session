module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/app/test/integration/'],
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
