import { Icon, SelectOption } from '@patternfly/react-core';
import { DesktopIcon, MoonIcon, SunIcon } from '@patternfly/react-icons';
import { THEME_MODES, ThemeMode, useTheme } from 'contexts/ThemeContext';
import React, { useState } from 'react';

import { Select } from 'components/Select/Select';

export const ThemeSwitch = () => {
  const { themeMode, setThemeMode } = useTheme();

  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);

  const getThemeIcon = (theme: ThemeMode) => {
    switch (theme) {
      case THEME_MODES.LIGHT:
        return <SunIcon />;
      case THEME_MODES.DARK:
        return <MoonIcon />;
      default:
        return <DesktopIcon />;
    }
  };

  return (
    <Select
      isOpen={isThemeSelectOpen}
      onToggle={setIsThemeSelectOpen}
      value={themeMode}
      onChange={(_event, theme) => {
        setThemeMode(theme);
        setIsThemeSelectOpen(false);
      }}
      toggleIcon={<Icon size="lg">{getThemeIcon(themeMode)}</Icon>}
    >
      <SelectOption value={THEME_MODES.SYSTEM} icon={<DesktopIcon />} description="Follow system preference">
        System
      </SelectOption>
      <SelectOption value={THEME_MODES.LIGHT} icon={<SunIcon />} description="Always use light mode">
        Light
      </SelectOption>
      <SelectOption value={THEME_MODES.DARK} icon={<MoonIcon />} description="Always use dark mode">
        Dark
      </SelectOption>
    </Select>
  );
};
