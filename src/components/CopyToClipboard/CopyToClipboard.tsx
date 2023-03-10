import { ClipboardCopy, Split, SplitItem } from '@patternfly/react-core';

interface ICopyToClipboardProps {
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
  isInline?: boolean;
  additionalActions?: React.ReactNode;
}

/**
 * CopyToClipboard item to display customized ClipboardCopy component.
 *
 * @param prefixComponent - any component before ClipboardCopy
 * @param suffixComponent - any component after ClipboardCopy
 * @param isInline - whether to use inline style for the component
 * @param additionalActions - component for additional actions, for inline style only
 * @param children - the content to be used for ClipboardCopy
 */
export const CopyToClipboard = ({
  prefixComponent,
  suffixComponent,
  isInline,
  additionalActions,
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
        additionalActions={additionalActions}
      >
        {children}
      </ClipboardCopy>
    </SplitItem>
    {suffixComponent && <SplitItem>{suffixComponent}</SplitItem>}
  </Split>
);
