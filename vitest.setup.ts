import '@testing-library/jest-dom';
import { vi } from 'vitest';

process.env.TZ = 'Europe/Bratislava';

vi.mock('hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isLoading: false,
    isAuthenticated: false,
    isError: false,
    user: null,
    error: null,
    hasRealmRole: () => false,
    login: vi.fn(() => Promise.resolve()),
    logout: vi.fn(() => Promise.resolve()),
  })),
}));

vi.mock('contexts/AuthContext', () => ({
  AuthContext: { Provider: ({ children }: any) => children },
  AuthProvider: ({ children }: any) => children,
}));

if (typeof window === 'undefined') {
  global.window = {} as any;
}
