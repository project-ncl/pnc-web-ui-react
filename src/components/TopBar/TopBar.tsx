import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { ReactElement, useEffect, useRef, useState } from 'react';

import styles from './TopBar.module.css';

export enum TOPBAR_TYPE {
  Error = 'top-bar-error',
  Warning = 'top-bar-warning',
  Info = 'top-bar-info',
}

interface ITopBarProps {
  type: TOPBAR_TYPE;
  icon: ReactElement;
}

/**
 * Top bar used to display:
 *  -> errors (e.g. Keycloak error)
 *  -> warnings
 *  -> info (e.g. announcements)
 *
 * It is possible to close the top bar. In that case, also information about its closed state will be stored in session storage.
 * (So page can be refreshed wihout reopening top bar.)
 * But: if children (inner text) is changed, top bar wil reopen.
 *
 * @param type - class to style top bar with
 * @param icon - icon displayed on the left side next to the top bar text
 */
export const TopBar = ({ children, type, icon }: React.PropsWithChildren<ITopBarProps>) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const firstRender = useRef(true);

  useEffect(() => {
    const topBarState = window.sessionStorage.getItem(type);
    setIsOpen(topBarState !== 'closed');
  }, [type]);

  useEffect(() => {
    if (!firstRender.current) {
      window.sessionStorage.setItem(type, 'open');
      setIsOpen(true);
    } else {
      firstRender.current = false;
    }
  }, [children, type]);

  return isOpen && children ? (
    <div className={`${styles['top-bar']} ${styles[type]}`}>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          <Flex spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>{icon}</FlexItem>
            <FlexItem>{children}</FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <Button
            onClick={() => {
              setIsOpen(false);
              window.sessionStorage.setItem(type, 'closed');
            }}
            variant="plain"
          >
            <TimesIcon className={styles['close-icon']} />
          </Button>
        </FlexItem>
      </Flex>
    </div>
  ) : null;
};
