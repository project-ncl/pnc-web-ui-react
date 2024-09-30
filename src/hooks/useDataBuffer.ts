import { throttle } from 'lodash-es';
import { useCallback, useMemo, useRef, useState } from 'react';

type PreprocessorFunction = (lines: string[]) => string[];

type AddLinesFunction = (lines: string[]) => void;

/**
 * Buffer of data with delay.
 * Data are in the format of array of string.
 *
 * Provides a way to delay inputted data before they are used.
 * Data can be preprocessed by preprocessor function, which processes inputted lines as programmer wishes.
 *
 * To add new lines, use addLines function. After that, they will be preprocessed with preprocessor function.
 * Buffer periodically - with delay - sets all input data to the output.
 *
 * @param delay - delay after which buffer outputs new data (if any)
 * @param preprocessor - function by which each added line is modified
 */
export const useDataBuffer = (
  preprocessor: PreprocessorFunction = (lines: string[]) => lines,
  delay: number = 750
): [string[], AddLinesFunction] => {
  // input to the buffer
  const dataIn = useRef<string[]>([]);
  // output from the buffer
  const [dataOut, setDataOut] = useState<string[]>([]);

  const sendDataOutThrottled = useMemo(
    () =>
      throttle(() => {
        setDataOut(dataIn.current);
      }, delay),
    [delay]
  );

  // adds new lines to the buffer and preprocesses them
  const addLines = useCallback(
    (lines: string[]) => {
      dataIn.current = [...dataIn.current, ...preprocessor(lines)];

      sendDataOutThrottled();
    },
    [preprocessor, sendDataOutThrottled]
  );

  return [dataOut, addLines];
};
