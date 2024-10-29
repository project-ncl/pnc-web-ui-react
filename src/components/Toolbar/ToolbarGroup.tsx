import { Flex, FlexProps } from '@patternfly/react-core';

const spaceItemsLg: FlexProps['spaceItems'] = { default: 'spaceItemsLg' };

/**
 *
 * Logical group of items in the toolbar, not necessary whole row of items.
 *
 */
export const ToolbarGroup = ({ children }: React.PropsWithChildren<{}>) => <Flex spaceItems={spaceItemsLg}>{children}</Flex>;
