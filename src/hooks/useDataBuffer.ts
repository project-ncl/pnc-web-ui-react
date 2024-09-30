import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

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
 * Each added group of lines is treated as a batch and outputted together.
 * Buffer periodically (with delay) checks if any new lines were added, and if so, it will add oldest batch of lines not yet ouputted.
 * Then, after delay, next batch will be outputted (if any), etc.
 *
 * @param delay - delay after which buffer outputs new data (if any)
 * @param preprocessor - function by which each added line is modified
 */
export const useDataBuffer = (
  preprocessor: PreprocessorFunction = (lines: string[]) => lines,
  delay: number = 750
): [string[], AddLinesFunction] => {
  // input to the buffer
  const [dataIn, setDataIn] = useState<string[]>([]);
  // output from the buffer
  const [dataOut, setDataOut] = useState<string[]>([]);
  // number of lines till now outputted
  const [currentLineCount, setCurrentLineCount] = useState<number>(0);
  // lengths of batches of new lines (added with addLines)
  const newLinesCounts = useRef<number[]>([]);

  const bufferInterval: MutableRefObject<NodeJS.Timeout | undefined> = useRef();

  useEffect(() => {
    bufferInterval.current = setInterval(() => {
      if (newLinesCounts.current.length) {
        setCurrentLineCount((currentLineCount) => currentLineCount + newLinesCounts.current[0]);
        newLinesCounts.current.shift();
      }
    }, delay);
    return () => {
      clearInterval(bufferInterval.current);
    };
  }, [delay]);

  useEffect(() => {
    setDataOut(dataIn.slice(0, currentLineCount));
    // this code has to execute only when currentLineCount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineCount]);

  // adds new lines to the buffer and preprocesses them
  const addLines = useCallback(
    (lines: string[]) => {
      setDataIn((dataIn) => [...dataIn, ...preprocessor(lines)]);
      newLinesCounts.current.push(lines.length);
    },
    [preprocessor]
  );

  return [dataOut, addLines];
};
