import { useRef, useEffect, MutableRefObject } from 'react';

export const useInterval = (callback: any, delay: number) => {
  const savedCallback: MutableRefObject<any> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, []);
};
