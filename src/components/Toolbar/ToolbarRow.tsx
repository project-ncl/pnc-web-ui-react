import { Flex, FlexProps } from '@patternfly/react-core';

import styles from './Toolbar.module.css';

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };

export const ToolbarRow = ({ children }: React.PropsWithChildren<{}>) => (
  <Flex spaceItems={spaceItemsNone} className={styles['toolbar__row']}>
    {children}
  </Flex>
);
