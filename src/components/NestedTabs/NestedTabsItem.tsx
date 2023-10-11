import { Tab, TabTitleIcon, TabTitleText } from '@patternfly/react-core';
import { PropsWithChildren, ReactNode } from 'react';

import styles from './NestedTabsItem.module.css';

interface INestedTabsItemProps {
  tabKey: number;
  icon?: ReactNode;
}

/**
 * One tab item on a tab panel of a section of a page.
 *
 * @param tabKey - Key / index of this tab item
 * @param icon - Icon of the tab item title
 * @param children - Title of the tab item
 */
export const NestedTabsItem = ({ tabKey, icon, children }: PropsWithChildren<INestedTabsItemProps>) => (
  <Tab
    className={styles['nested-tabs-item']}
    eventKey={tabKey}
    tabContentId={`content-${tabKey}`}
    title={
      <>
        {icon && <TabTitleIcon>{icon}</TabTitleIcon>}
        <TabTitleText>{children}</TabTitleText>
      </>
    }
  />
);
