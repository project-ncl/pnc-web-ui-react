import { PageSection, PageSectionProps, PageSectionVariants } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import styles from './Tabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

interface ITabsProps {
  children: ReactElement | ReactElement[];
}

export const Tabs = ({ children }: ITabsProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const tabContent = document.getElementById('tab-content');

  const onResize = useCallback(() => {
    tabContent && setShowScrollButton(tabContent.scrollWidth > window.innerWidth);
  }, [tabContent]);

  window.addEventListener('resize', onResize);

  const scrollLeft = () => {
    if (tabContent) {
      tabContent.scrollLeft = tabContent.scrollLeft ? tabContent.scrollLeft - 150 : 0;
    }
  };
  const scrollRight = () => {
    if (tabContent) {
      tabContent.scrollLeft = tabContent.scrollLeft ? tabContent.scrollLeft + 150 : 150;
    }
  };

  useEffect(onResize, [onResize]);

  return (
    <PageSection
      stickyOnBreakpoint={stickyOnBreakpoint}
      className={styles['page-section-tabs']}
      type="tabs"
      variant={PageSectionVariants.light}
    >
      <div className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets, showScrollButton && stylesPF.modifiers.scrollable)}>
        <button className={css(stylesPF.tabsScrollButton)} type="button" aria-label="Scroll left" onClick={scrollLeft}>
          <AngleLeftIcon />
        </button>
        <ul id="tab-content" className={stylesPF.tabsList}>
          {children}
        </ul>
        <button className={css(stylesPF.tabsScrollButton)} type="button" aria-label="Scroll right" onClick={scrollRight}>
          <AngleRightIcon />
        </button>
      </div>
    </PageSection>
  );
};
