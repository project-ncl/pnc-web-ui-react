import { useEffect, useState } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const onFullscrenChange = () => setIsFullscreen((state) => !state);
    document.addEventListener('fullscreenchange', onFullscrenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscrenChange);
  }, []);

  return { isFullscreen };
};
