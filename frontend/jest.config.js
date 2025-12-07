export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/utils$': '<rootDir>/src/utils/index.jsx',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    // Mock import.meta.env
    '^(\\.{1,2}/.*)\\.jsx$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.{js,jsx}',
    '**/src/**/*.{spec,test}.{js,jsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*stories.{js,jsx}',
    '!src/setupTests.{js,jsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(css|svg)$': 'jest-transform-stub',
  },
  globals: {
    'import.meta': {
      env: {
        VITE_BACKEND_URL: 'http://localhost:3001'
      }
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|@react-hook|@radix-ui|@babel/runtime/helpers/esm|lucide-react))',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/tests/', '/playwright-report/'],
};