import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { StorageKeys, useStorage } from 'hooks/useStorage';

export const THEME_MODES = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

type ResolvedThemeMode = Omit<ThemeMode, 'system'>;

const DARK_SCHEME_MATCH_MEDIA = '(prefers-color-scheme: dark)';

const DARK_MODE_CLASS = 'pf-v6-theme-dark';

type ThemeContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedThemeMode: ResolvedThemeMode;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { storageValue: themeMode, storeToStorage: storeThemeMode } = useStorage<ThemeMode>({
    storageKey: StorageKeys.themeMode,
    initialValue: THEME_MODES.SYSTEM,
  });

  const getResolvedTheme = (theme: ThemeMode) => {
    if (theme !== THEME_MODES.SYSTEM) {
      return theme;
    }

    return window.matchMedia(DARK_SCHEME_MATCH_MEDIA).matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
  };

  const updateHtmlElementThemeClass = (resolvedTheme: ResolvedThemeMode) => {
    const htmlElement = document.querySelector('html');
    if (!htmlElement) {
      return;
    }

    if (resolvedTheme === THEME_MODES.DARK) {
      htmlElement.classList.add(DARK_MODE_CLASS);
    } else {
      htmlElement.classList.remove(DARK_MODE_CLASS);
    }
  };

  const [resolvedThemeMode, setResolvedThemeMode] = useState<ResolvedThemeMode>(() => {
    const resolvedTheme = getResolvedTheme(themeMode);
    updateHtmlElementThemeClass(resolvedTheme);
    return resolvedTheme;
  });

  const setThemeMode = useCallback(
    (newTheme: ThemeMode) => {
      storeThemeMode(newTheme);

      const newResolvedTheme = getResolvedTheme(newTheme);
      setResolvedThemeMode(newResolvedTheme);
      updateHtmlElementThemeClass(newResolvedTheme);
    },
    [storeThemeMode]
  );

  // listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_SCHEME_MATCH_MEDIA);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === THEME_MODES.SYSTEM) {
        const newSystemTheme = e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        setResolvedThemeMode(newSystemTheme);
        updateHtmlElementThemeClass(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode]);

  return <ThemeContext.Provider value={{ themeMode, setThemeMode, resolvedThemeMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within the scope of ThemeProvider');
  }

  return context;
};
