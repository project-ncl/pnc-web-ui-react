import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Tabs/tabs';
import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ITabsItemProps {
  url: string;
}

export const TabsItem = ({ children, url }: PropsWithChildren<ITabsItemProps>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <li className={css(styles.tabsItem, pathname.includes(url) && styles.modifiers.current)}>
      <button onClick={() => navigate(url)} type="button" className={styles.tabsLink}>
        <span className={styles.tabsItemText}>{children}</span>
      </button>
    </li>
  );
};
