import { useLayoutEffect, useState } from 'react';

/**
 * Hook that observes and returns current width and height of the browser window.
 *
 * @returns object containing windowWidth and windowHeight
 * - windowWidth - Width of the browser window
 * - windowHeight - Height of the browser window
 */
export const useWindowSizeObserver = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const updateSize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { windowWidth, windowHeight };
};
