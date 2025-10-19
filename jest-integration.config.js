module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/app/test/integration/**/*.integration-spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  setupFiles: ['dotenv/config'],
  testTimeout: 60_000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/src/$1',
    '^@const$': '<rootDir>/app/src/const',
    '^@const/(.*)$': '<rootDir>/app/src/const/$1',
    '^@shooting-session/(.*)$': '<rootDir>/app/src/shooting-session/$1',
    '^@data-access-layer/(.*)$': '<rootDir>/app/src/data-access-layer/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['app/src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
