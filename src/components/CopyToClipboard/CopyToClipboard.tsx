import { ClipboardCopy, ClipboardCopyAction, Split, SplitItem } from '@patternfly/react-core';

import styles from './CopyToClipboard.module.css';

interface ICopyToClipboardProps {
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
  isInline?: boolean;
}

/**
 * CopyToClipboard item to display customized ClipboardCopy component.
 *
 * @param prefixComponent - any component before ClipboardCopy
 * @param suffixComponent - any component after ClipboardCopy
 * @param isInline - whether to use inline style for the component
 * @param children - the content to be used for ClipboardCopy
 */
export const CopyToClipboard = ({
  prefixComponent,
  suffixComponent,
  isInline,
  children,
}: React.PropsWithChildren<ICopyToClipboardProps>) => (
  <Split hasGutter>
    {prefixComponent && <SplitItem>{prefixComponent}</SplitItem>}
    <SplitItem isFilled>
      <ClipboardCopy
        removeFindDomNode
        isReadOnly
        hoverTip="Copy"
        clickTip="Copied"
        variant={isInline ? 'inline-compact' : 'inline'}
        additionalActions={<ClipboardCopyAction>{suffixComponent}</ClipboardCopyAction>}
        className={styles['no-bg']}
      >
        {children}
      </ClipboardCopy>
    </SplitItem>
    {suffixComponent && !isInline && <SplitItem>{suffixComponent}</SplitItem>}
  </Split>
);
