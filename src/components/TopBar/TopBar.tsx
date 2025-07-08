import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import ReactDomServer from 'react-dom/server';

import { useStorage } from 'hooks/useStorage';

import styles from './TopBar.module.css';

export enum TOPBAR_TYPE {
  Error = 'top-bar-error',
  Warning = 'top-bar-warning',
  Info = 'top-bar-info',
}

interface ITopBarProps {
  id?: string;
  type: TOPBAR_TYPE;
  icon: ReactElement;
  hideCloseButton?: boolean;
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
 * @param id -unique ID, if defined, close status is stored to session storage
 * @param type - class to style top bar with
 * @param icon - icon displayed on the left side next to the top bar text
 * @param hideCloseButton - whether to hide close button
 */
export const TopBar = ({ children, id, type, icon, hideCloseButton = false }: React.PropsWithChildren<ITopBarProps>) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const topBarStateStorageKey = useMemo(() => `${id}-status`, [id]);
  const topBarTextStorageKey = useMemo(() => `${id}-text`, [id]);

  const { storageValue: topBarState, storeToStorage: storeTopBarState } = useStorage<'open' | 'closed'>({
    storageKey: topBarStateStorageKey,
    initialValue: 'open',
    storage: sessionStorage,
  });

  const { storageValue: topBarText, storeToStorage: storeTopBarText } = useStorage<string>({
    storageKey: topBarTextStorageKey,
    initialValue: '',
    storage: sessionStorage,
  });

  useEffect(() => {
    if (id) {
      setIsOpen(topBarState !== 'closed');
    }
  }, [type, id, topBarState]);

  useEffect(() => {
    if (id) {
      const topBarTextNew = ReactDomServer.renderToStaticMarkup(<>{children}</>);

      if (topBarTextNew !== topBarText) {
        storeTopBarText(topBarTextNew);
        storeTopBarState('open');
        setIsOpen(true);
      }
    }
  }, [children, type, id, topBarText, storeTopBarText, storeTopBarState]);

  return isOpen && children ? (
    <div className={`${styles['top-bar']} ${styles[type]}`}>
      <div>
        <span className="m-r-5">{icon}</span>
        {children}
      </div>

      {!hideCloseButton && (
        <Button
          onClick={() => {
            setIsOpen(false);
            storeTopBarState('closed');
          }}
          variant="plain"
          icon={<TimesIcon className={styles['close-icon']} />}
        />
      )}
    </div>
  ) : null;
};
