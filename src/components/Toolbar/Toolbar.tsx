import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

const flexSpaceItems: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IToolbarProps {
  borderTop?: boolean;
}

export const Toolbar = ({ children, borderTop = false }: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox borderTop={borderTop} padding>
    <Flex spaceItems={flexSpaceItems}>{children}</Flex>
  </ContentBox>
);
