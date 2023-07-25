import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Tabs/tabs';
import { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ITabsItemProps {
  url: string;
}

export const TabsItem = ({ children, url }: PropsWithChildren<ITabsItemProps>) => {
  const { pathname } = useLocation();

  return (
    <li className={css(styles.tabsItem, pathname.includes(url) && styles.modifiers.current)}>
      <Link to={url} className={styles.tabsLink}>
        <span className={styles.tabsItemText}>{children}</span>
      </Link>
    </li>
  );
};
