import { vi } from 'vitest';

export const THEME_MODES = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const useTheme = () => ({
  themeMode: 'light',
  setThemeMode: vi.fn(),
  resolvedThemeMode: 'light',
});
