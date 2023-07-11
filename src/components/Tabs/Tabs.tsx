import { PageSection, PageSectionProps, PageSectionVariants } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import styles from './Tabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

const SCROLL_BUTTON_SIZE = 150;
const SCROLL_TOUCH_SIZE = 5;

interface ITabsProps {
  children: ReactElement | ReactElement[];
}

export const Tabs = ({ children }: ITabsProps) => {
  const [isScrollButtonDisplay, setIsScrollButtonDisplay] = useState<boolean>(false);
  const [isScrollLeftDisable, setIsScrollLeftDisable] = useState<boolean>(true);
  const [isScrollRightDisable, setIsScrollRightDisable] = useState<boolean>(false);
  const tabContent = useRef<HTMLUListElement>(null);

  const onResize = useCallback(() => {
    tabContent.current && setIsScrollButtonDisplay(tabContent.current.scrollWidth > window.innerWidth);
  }, [tabContent]);

  const scrollLeft = () => {
    if (tabContent.current) {
      setIsScrollRightDisable(false);
      setIsScrollLeftDisable(tabContent.current.scrollLeft - SCROLL_BUTTON_SIZE <= 0);
      tabContent.current.scrollLeft = tabContent.current.scrollLeft ? tabContent.current.scrollLeft - SCROLL_BUTTON_SIZE : 0;
    }
  };

  const scrollRight = () => {
    if (tabContent.current) {
      setIsScrollLeftDisable(false);
      setIsScrollRightDisable(
        tabContent.current.scrollWidth <= window.innerWidth + tabContent.current.scrollLeft + SCROLL_BUTTON_SIZE
      );
      tabContent.current.scrollLeft = tabContent.current.scrollLeft
        ? tabContent.current.scrollLeft + SCROLL_BUTTON_SIZE
        : SCROLL_BUTTON_SIZE;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <PageSection
      stickyOnBreakpoint={stickyOnBreakpoint}
      className={styles['page-section-tabs']}
      type="tabs"
      variant={PageSectionVariants.light}
    >
      <div className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets, isScrollButtonDisplay && stylesPF.modifiers.scrollable)}>
        <button
          disabled={isScrollLeftDisable}
          className={css(stylesPF.tabsScrollButton)}
          type="button"
          aria-label="Scroll left"
          onClick={scrollLeft}
        >
          <AngleLeftIcon />
        </button>
        <ul
          ref={tabContent}
          onScroll={() => {
            if (tabContent.current) {
              setIsScrollLeftDisable(tabContent.current.scrollLeft - SCROLL_TOUCH_SIZE <= 0);
              setIsScrollRightDisable(
                tabContent.current.scrollLeft + tabContent.current.offsetWidth + SCROLL_TOUCH_SIZE >=
                  tabContent.current.scrollWidth
              );
            }
          }}
          className={stylesPF.tabsList}
        >
          {children}
        </ul>
        <button
          disabled={isScrollRightDisable}
          className={css(stylesPF.tabsScrollButton)}
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
