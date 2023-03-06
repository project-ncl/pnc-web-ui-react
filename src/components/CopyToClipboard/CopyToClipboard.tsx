import { ClipboardCopy, Split, SplitItem } from '@patternfly/react-core';

interface ICopyToClipboard {
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
}
export const CopyToClipboard = ({ prefixComponent, suffixComponent, children }: React.PropsWithChildren<ICopyToClipboard>) => {
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
