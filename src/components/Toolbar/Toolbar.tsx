import { Flex, FlexProps } from '@patternfly/react-core';

const flexSpaceItems: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

interface IToolbarProps {}

export const Toolbar = ({ children }: React.PropsWithChildren<IToolbarProps>) => (
  <div className="p-global bg-w border-b">
    <Flex spaceItems={flexSpaceItems}>{children}</Flex>
  </div>
);
