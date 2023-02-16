import { PageSection, PageSectionVariants, Tabs as TabsPF } from '@patternfly/react-core';
import { Children, ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TabItem } from 'components/Tabs/TabItem';

import styles from './Tabs.module.css';

interface ITabs {
  children: ReactElement[];
}

export const Tabs = ({ children }: ITabs) => {
  const [activeTabKey, setActiveTabKey] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    Children.forEach(children, (child, index) => {
      if (pathname.includes(child.props.url)) {
        setActiveTabKey(index);
      }
    });
  }, [children, pathname]);

  return (
    <PageSection className={styles['page-section-tabs']} type="tabs" variant={PageSectionVariants.light}>
      <TabsPF activeKey={activeTabKey} usePageInsets>
        {Children.map(children, (child, index) => (
          <TabItem url={child.props.url} index={index}>
            {child.props.children}
          </TabItem>
        ))}
      </TabsPF>
    </PageSection>
  );
};
