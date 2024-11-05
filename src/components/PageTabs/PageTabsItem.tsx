import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Tabs/tabs';
import { PropsWithChildren, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import pageTabsItemStyles from './PageTabsItem.module.css';

interface IPageTabsItemProps {
  url: string;
  isDisabled?: boolean;
  tooltip?: string;
}

export const PageTabsItem = ({ children, url, isDisabled = false, tooltip }: PropsWithChildren<IPageTabsItemProps>) => {
  const { pathname } = useLocation();

  const urlPath = useMemo(() => url.split('?').at(0) || '', [url]);

  return (
    <li className={css(styles.tabsItem, pathname.includes(urlPath) && styles.modifiers.current)}>
      <TooltipWrapper tooltip={tooltip}>
        <Link
          to={url}
          className={css(styles.tabsLink, isDisabled && styles.modifiers.ariaDisabled, pageTabsItemStyles['page-tabs-item_link'])}
          aria-disabled={isDisabled}
        >
          <span className={styles.tabsItemText}>{children}</span>
        </Link>
      </TooltipWrapper>
    </li>
  );
};
