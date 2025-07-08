import { PageSection, PageSectionProps } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement, useRef, useState } from 'react';

import { useResizeObserver } from 'hooks/useResizeObserver';

import styles from './PageTabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

const SCROLL_OFFSET = 150;
const SCROLL_DISABLED_AREA = 5;

interface IPageTabsProps {
  children: ReactElement | ReactElement[];
}

export const PageTabs = ({ children }: IPageTabsProps) => {
  const [isScrollLeftDisabled, setIsScrollLeftDisabled] = useState<boolean>(true);
  const [isScrollRightDisabled, setIsScrollRightDisabled] = useState<boolean>(false);

  const scrollLeft = () => {
    if (tabContent.current) {
      tabContent.current.scrollLeft = tabContent.current.scrollLeft ? tabContent.current.scrollLeft - SCROLL_OFFSET : 0;
    }
  };

  const scrollRight = () => {
    if (tabContent.current) {
      tabContent.current.scrollLeft = tabContent.current.scrollLeft
        ? tabContent.current.scrollLeft + SCROLL_OFFSET
        : SCROLL_OFFSET;
    }
  };

  const { ref: tabContentRef, width: tabContentWidth } = useResizeObserver();
  const tabContent = useRef<HTMLUListElement | null>(null);

  return (
    <PageSection
      stickyOnBreakpoint={stickyOnBreakpoint}
      className={styles['page-section-tabs']}
      type="tabs"
      hasBodyWrapper={false}
    >
      <div
        className={css(
          stylesPF.tabs,
          stylesPF.modifiers.pageInsets,
          tabContentWidth &&
            tabContent.current?.scrollWidth &&
            tabContentWidth < tabContent.current.scrollWidth &&
            stylesPF.modifiers.scrollable
        )}
      >
        <button
          disabled={isScrollLeftDisabled}
          className={stylesPF.tabsScrollButton}
          type="button"
          aria-label="Scroll left"
          onClick={scrollLeft}
        >
          <AngleLeftIcon />
        </button>
        <ul
          ref={(node) => {
            tabContent.current = node;
            tabContentRef(node);
          }}
          onScroll={() => {
            if (tabContent.current) {
              setIsScrollLeftDisabled(tabContent.current.scrollLeft - SCROLL_DISABLED_AREA <= 0);
              setIsScrollRightDisabled(
                tabContent.current.scrollLeft + tabContent.current.offsetWidth + SCROLL_DISABLED_AREA >=
                  tabContent.current.scrollWidth
              );
            }
          }}
          className={stylesPF.tabsList}
        >
          {children}
        </ul>
        <button
          disabled={isScrollRightDisabled}
          className={stylesPF.tabsScrollButton}
          type="button"
          aria-label="Scroll right"
          onClick={scrollRight}
        >
          <AngleRightIcon />
        </button>
      </div>
    </PageSection>
  );
};
