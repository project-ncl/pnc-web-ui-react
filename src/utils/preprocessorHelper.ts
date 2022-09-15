/**
 * Highlights timestamps in lines of text by using ANSI escape sequences.
 * Timestamp is expected to be in format: [TIMESTAMP]
 *
 * @param lines - lines of text
 * @returns lines with timestamps highlighted
 */
export const timestampHiglighter = (lines: string[]) => {
  const preprocessed: string[] = [];

  lines.forEach((value: string, index: number) => {
    const i = value.indexOf(']') + 1;
    preprocessed.push(`\u001b[38;5;231m\u001b[40;1m${value.slice(0, i)}\u001b[38;5;0m\u001b[0m${value.slice(i)}`);
  });

  return preprocessed;
};
