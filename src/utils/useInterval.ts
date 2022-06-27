import { useRef, useEffect, MutableRefObject } from 'react';

/**
 * React hook for setting up and using intervals.
 *
 * @param callback - Function to be called every interval tick
 * @param delay - Delay in ms between interval ticks
 * @param runImmediately - Whether the callback should be run at the begging
 */
export const useInterval = (callback: Function, delay: number, runImmediately: boolean = false) => {
  const savedCallback: MutableRefObject<any> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (runImmediately) {
      savedCallback.current();
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay, runImmediately]);
};
