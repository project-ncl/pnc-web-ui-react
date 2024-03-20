import { TextArea, TextAreaProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useMemo, useState } from 'react';

import styles from './CodeEditor.module.css';

interface ICodeEditorProps extends TextAreaProps {
  value: string;
}

export const CodeEditor = ({ value, onBlur, ...textAreaProps }: ICodeEditorProps) => {
  const lineNumbers = useMemo(() => value.split('\n').map((_, index) => index + 1), [value]);
  const [currentLineNumber, setCurrentLineNumber] = useState<number>();

  const textAreaHeight = useMemo(() => {
    const lineCount = lineNumbers.length;
    const lineHeight = 21; // see .code-editor-shared class
    const padding = 25;

    return lineCount * lineHeight + padding;
  }, [lineNumbers.length]);

  return (
    <div className={styles['code-editor-wrapper']}>
      <div className={css(styles['code-editor-line-numbers'], styles['code-editor-shared'])}>
        {lineNumbers.map((lineNumber) => (
          <div key={lineNumber} className={css(currentLineNumber === lineNumber && styles['code-editor-current-line'])}>
            {lineNumber}
          </div>
        ))}
      </div>
      <TextArea
        style={{ height: `${textAreaHeight}px` }}
        value={value}
        className={css(styles['code-editor-text-area'], styles['code-editor-shared'])}
        onSelectCapture={(event) => {
          const target = event.target as HTMLTextAreaElement;
          setCurrentLineNumber(target.value?.slice(0, target.selectionStart).split('\n').length);
        }}
        onBlur={(event) => {
          setCurrentLineNumber(undefined);
          onBlur?.(event);
        }}
        {...textAreaProps}
      />
    </div>
  );
};
