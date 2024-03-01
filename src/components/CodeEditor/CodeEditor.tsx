import { TextArea } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useMemo, useState } from 'react';

import styles from './CodeEditor.module.css';

interface ICodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export const CodeEditor = ({ code, onChange }: ICodeEditorProps) => {
  const lineNumbers = useMemo(() => code.split('\n').map((_, index) => index + 1), [code]);
  const [currentLineNumber, setCurrentLineNumber] = useState<number>();

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
        className={css(styles['code-editor-text-area'], styles['code-editor-shared'])}
        autoResize
        value={code}
        onChange={onChange}
        onSelectCapture={(event) => {
          const target = event.target as HTMLTextAreaElement;
          setCurrentLineNumber(target.value?.slice(0, target.selectionStart).split('\n').length);
        }}
        onBlur={() => setCurrentLineNumber(undefined)}
      />
    </div>
  );
};
