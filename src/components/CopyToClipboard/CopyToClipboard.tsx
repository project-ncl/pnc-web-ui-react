import { ClipboardCopy, Split, SplitItem } from '@patternfly/react-core';

interface ICopyToClipboardProps {
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
}

/**
 * CopyToClipboard item to display customized ClipboardCopy component
 *
 * @param prefixComponent - any component before ClipboardCopy
 * @param prefixComponent - any component after ClipboardCopy
 * @param children - the content to be used for ClipboardCopy
 */
export const CopyToClipboard = ({
  prefixComponent,
  suffixComponent,
  children,
}: React.PropsWithChildren<ICopyToClipboardProps>) => {
  return (
    <Split hasGutter>
      {prefixComponent && <SplitItem>{prefixComponent}</SplitItem>}
      <SplitItem isFilled>
        <ClipboardCopy removeFindDomNode isReadOnly hoverTip="Copy" clickTip="Copied">
          {children}
        </ClipboardCopy>
      </SplitItem>
      {suffixComponent && <SplitItem>{suffixComponent}</SplitItem>}
    </Split>
  );
};
