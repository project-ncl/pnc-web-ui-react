import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };
const styleGap = { gap: '1.5rem' };

interface IToolbarProps {
  borderTop?: boolean;
}

export const Toolbar = ({ children, borderTop = false }: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox borderTop={borderTop} padding>
    <Flex spaceItems={spaceItemsNone} style={styleGap}>
      {children}
    </Flex>
  </ContentBox>
);
