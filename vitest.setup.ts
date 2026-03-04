import '@testing-library/jest-dom';
import { vi } from 'vitest';

process.env.TZ = 'Europe/Bratislava';

vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: null,
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  })),
  AuthProvider: ({ children }: any) => children,
}));

if (typeof window === 'undefined') {
  global.window = {} as any;
}
