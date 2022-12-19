import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

const flexSpaceItems: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IToolbarProps {}

export const Toolbar = ({ children }: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox padding>
    <Flex spaceItems={flexSpaceItems}>{children}</Flex>
  </ContentBox>
);
