import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { ReactElement, useEffect, useMemo } from 'react';
import ReactDomServer from 'react-dom/server';

import { useStorage } from 'hooks/useStorage';

import styles from './TopBar.module.css';

export type TopBarType = 'error' | 'warning' | 'info';

interface ITopBarProps {
  id?: string;
  type: TopBarType;
  icon: ReactElement;
  hideCloseButton?: boolean;
}

/**
 * Top bar used to display:
 *  -> error
 *  -> warning
 *  -> info (e.g. announcement)
 *
 * @param id - unique ID, if defined, close status is stored to session storage
 * @param type - class to style top bar with
 * @param icon - icon displayed on the left side next to the top bar text
 * @param hideCloseButton - whether to hide close button
 */
export const TopBar = ({ children, id, type, icon, hideCloseButton = false }: React.PropsWithChildren<ITopBarProps>) => {
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

  const isOpen = useMemo(() => topBarState !== 'closed', [topBarState]);

  useEffect(() => {
    if (id) {
      const topBarTextNew = ReactDomServer.renderToStaticMarkup(<>{children}</>);

      if (topBarTextNew !== topBarText) {
        storeTopBarText(topBarTextNew);
        storeTopBarState('open');
      }
    }
  }, [children, type, id, topBarText, storeTopBarText, storeTopBarState]);

  return isOpen && children ? (
    <div className={css(styles['top-bar'], styles[`top-bar--${type}`])}>
      <div>
        <span className="m-r-5">{icon}</span>
        {children}
      </div>

      {!hideCloseButton && (
        <Button
          variant="plain"
          onClick={() => {
            storeTopBarState('closed');
          }}
          icon={<TimesIcon className={styles[`top-bar__close-icon--${type}`]} />}
        />
      )}
    </div>
  ) : null;
};
