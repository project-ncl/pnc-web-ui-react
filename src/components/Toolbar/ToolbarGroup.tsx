import { Flex } from '@patternfly/react-core';

/**
 *
 * Logical group of items in the toolbar, not necessary whole row of items.
 *
 */
export const ToolbarGroup = ({ children }: React.PropsWithChildren<{}>) => <Flex spaceItems={flexSpaceItemsSm}>{children}</Flex>;

const flexSpaceItemsSm = { default: 'spaceItemsSm' } as const;
