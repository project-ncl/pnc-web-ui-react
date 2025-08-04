import { Flex } from '@patternfly/react-core';

/**
 *
 * Logical group of items in the toolbar, not necessary whole row of items.
 *
 */
export const ToolbarGroup = ({ children }: React.PropsWithChildren<{}>) => <Flex spaceItems={flexSpaceItemsMd}>{children}</Flex>;

const flexSpaceItemsMd = { default: 'spaceItemsMd' } as const;
