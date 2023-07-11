import { PageSection, PageSectionProps, PageSectionVariants } from '@patternfly/react-core';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import stylesPF from '@patternfly/react-styles/css/components/Tabs/tabs';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import styles from './Tabs.module.css';

const stickyOnBreakpoint: PageSectionProps['stickyOnBreakpoint'] = { default: 'top' };

interface ITabsProps {
  children: ReactElement | ReactElement[];
}

export const Tabs = ({ children }: ITabsProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [disableScrollLeft, setDisableScrollLeft] = useState(true);
  const [disableScrollRight, setDisableScrollRight] = useState(false);
  const tabContent = useRef<HTMLUListElement>(null);

  const onResize = useCallback(() => {
    tabContent.current && setShowScrollButton(tabContent.current.scrollWidth > window.innerWidth);
  }, [tabContent]);

  const scrollLeft = () => {
    if (tabContent.current) {
      setDisableScrollRight(false);
      setDisableScrollLeft(tabContent.current.scrollLeft - 150 <= 0);
      tabContent.current.scrollLeft = tabContent.current.scrollLeft ? tabContent.current.scrollLeft - 150 : 0;
    }
  };

  const scrollRight = () => {
    if (tabContent.current) {
      setDisableScrollLeft(false);
      setDisableScrollRight(tabContent.current.scrollWidth <= window.innerWidth + tabContent.current.scrollLeft + 150);
      tabContent.current.scrollLeft = tabContent.current.scrollLeft ? tabContent.current.scrollLeft + 150 : 150;
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
      <div className={css(stylesPF.tabs, stylesPF.modifiers.pageInsets, showScrollButton && stylesPF.modifiers.scrollable)}>
        <button
          disabled={disableScrollLeft}
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
              setDisableScrollLeft(tabContent.current.scrollLeft - 5 <= 0);
              setDisableScrollRight(
                tabContent.current.scrollLeft + tabContent.current.offsetWidth + 5 >= tabContent.current.scrollWidth
              );
            }
          }}
          className={stylesPF.tabsList}
        >
          {children}
        </ul>
        <button
          disabled={disableScrollRight}
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
