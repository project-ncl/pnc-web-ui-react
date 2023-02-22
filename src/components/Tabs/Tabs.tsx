import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement } from 'react';

import styles from './Tabs.module.css';

interface ITabProps {
  children: ReactElement | ReactElement[];
}

export const Tabs = ({ children }: ITabProps) => {
  return (
    <PageSection
      stickyOnBreakpoint={{ default: 'top' }}
      className={styles['page-section-tabs']}
      type="tabs"
      variant={PageSectionVariants.light}
    >
      <div className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets)}>
        <ul className={stylesPF.tabsList}>{children}</ul>
      </div>
    </PageSection>
  );
};
