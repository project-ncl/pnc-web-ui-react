import { ClipboardCopy, Split, SplitItem } from '@patternfly/react-core';

interface ICopyToClipboard {
  url: string;
  prefixComponent?: React.ReactNode;
  suffixComponent?: React.ReactNode;
}
export const CopyToClipboard = ({ url, prefixComponent, suffixComponent }: ICopyToClipboard) => {
  return (
    <Split hasGutter>
      {prefixComponent && <SplitItem>{prefixComponent}</SplitItem>}
      <SplitItem isFilled>
        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
          {url}
        </ClipboardCopy>
      </SplitItem>
      {suffixComponent && <SplitItem>{suffixComponent}</SplitItem>}
    </Split>
  );
};
