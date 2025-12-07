import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add missing globals for jsdom environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock import.meta.env for Vite
global.import = {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:3001'
    }
  }
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;