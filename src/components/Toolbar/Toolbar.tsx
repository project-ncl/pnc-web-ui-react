import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };
const styleGap = { gap: '1.5rem' };

interface IToolbarProps {
  borderTop?: boolean;
  padding?: boolean;
  disablePaddingTop?: boolean;
  disablePaddingBottom?: boolean;
}

export const Toolbar = ({
  children,
  borderTop,
  padding = true,
  disablePaddingTop,
  disablePaddingBottom,
}: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox
    borderTop={borderTop}
    paddingTop={padding && !disablePaddingTop}
    paddingBottom={padding && !disablePaddingBottom}
    paddingLeft={padding}
    paddingRight={padding}
  >
    <Flex spaceItems={spaceItemsNone} style={styleGap}>
      {children}
    </Flex>
  </ContentBox>
);
