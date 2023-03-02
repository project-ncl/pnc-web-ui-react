import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Tabs/tabs';
import { PropsWithChildren } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

export interface ITabsItemProps {
  basePath?: string;
  relativePath: string;
}

export const TabsItem = ({ children, basePath, relativePath }: PropsWithChildren<ITabsItemProps>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const fullPath = basePath ? `${basePath}/${relativePath}` : relativePath;

  return (
    <li className={css(styles.tabsItem, matchPath(fullPath, pathname) && styles.modifiers.current)}>
      <button onClick={() => navigate(relativePath)} type="button" className={styles.tabsLink}>
        <span className={styles.tabsItemText}>{children}</span>
      </button>
    </li>
  );
};
