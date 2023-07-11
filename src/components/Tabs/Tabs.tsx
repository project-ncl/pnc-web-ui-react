import { PageSection, PageSectionProps, PageSectionVariants } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement, useEffect, useRef, useState } from 'react';

import styles from './Tabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

const SCROLL_OFFSET = 150;
const SCROLL_DISABLED_AREA = 5;

interface ITabsProps {
  children: ReactElement | ReactElement[];
}

export const Tabs = ({ children }: ITabsProps) => {
  const [isScrollButtonDisplayed, setIsScrollButtonDisplayed] = useState<boolean>(false);
  const [isScrollLeftDisabled, setIsScrollLeftDisabled] = useState<boolean>(true);
  const [isScrollRightDisabled, setIsScrollRightDisabled] = useState<boolean>(false);
  const tabContent = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    const onResize = () => tabContent.current && setIsScrollButtonDisplayed(tabContent.current.scrollWidth > window.innerWidth);

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <PageSection
      stickyOnBreakpoint={stickyOnBreakpoint}
      className={styles['page-section-tabs']}
      type="tabs"
      variant={PageSectionVariants.light}
    >
      <div
        className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets, isScrollButtonDisplayed && stylesPF.modifiers.scrollable)}
      >
        <button
          disabled={isScrollLeftDisabled}
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
