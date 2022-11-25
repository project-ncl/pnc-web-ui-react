import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

/**
 * React hook for setting up and using intervals.
 * As suggested by Dan Abramov in a blog post here:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback - Function to be called every interval tick
 * @param delay - Delay in ms between interval ticks
 * @param runImmediately - Whether the callback should be run at the begging
 * @returns function to restart the interval
 */
export const useInterval = (callback: Function, delay: number, runImmediately: boolean = false) => {
  const savedCallback: MutableRefObject<Function | undefined> = useRef();
  // useRef needs to be used here since if it was declared as a let variable,
  // it would not persist the state during rerenders
  const savedTimer: MutableRefObject<NodeJS.Timer | undefined> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (runImmediately) {
      savedCallback.current!();
    }
    savedTimer.current = setInterval(() => {
      savedCallback.current!();
    }, delay);
    return () => clearInterval(savedTimer.current);
  }, [delay, runImmediately]);

  const restart = useCallback(() => {
    clearInterval(savedTimer.current);
    savedTimer.current = setInterval(() => {
      savedCallback.current!();
    }, delay);
  }, [delay]);

  return restart;
};
