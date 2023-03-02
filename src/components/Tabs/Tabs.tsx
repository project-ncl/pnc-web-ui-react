import { PageSection, PageSectionProps, PageSectionVariants } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { Children, PropsWithChildren, ReactElement, cloneElement, isValidElement } from 'react';

import { ITabsItemProps } from 'components/Tabs/TabsItem';

import styles from './Tabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

interface ITabsProps {
  children: ReactElement | ReactElement[];
  basePath?: string;
}

export const Tabs = ({ children, basePath }: ITabsProps) => {
  return (
    <PageSection
      stickyOnBreakpoint={stickyOnBreakpoint}
      className={styles['page-section-tabs']}
      type="tabs"
      variant={PageSectionVariants.light}
    >
      <div className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets)}>
        <ul className={stylesPF.tabsList}>
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child as ReactElement<PropsWithChildren<ITabsItemProps>>, { basePath });
            }
            return child;
          })}
        </ul>
      </div>
    </PageSection>
  );
};
