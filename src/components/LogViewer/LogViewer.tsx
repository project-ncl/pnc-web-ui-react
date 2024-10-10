import { css } from '@patternfly/react-styles';
import { ReactNode, useRef, useState } from 'react';

import { StorageKeys, useStorage } from 'hooks/useStorage';

import { LogViewerBase } from 'components/LogViewer/LogViewerBase';
import { LogViewerToolbar } from 'components/LogViewer/LogViewerToolbar';

import styles from './LogViewer.module.css';

interface ILogViewerProps {
  isStatic?: boolean;
  data: string | string[];
  heightOffset?: number;
  customActions?: ReactNode[];
}

/**
 * Log viewer component to display logs.
 * Log viewer is considered to be paused when it is not scrolled to the bottom.
 * Whe log viewer is paused, data are not rendered (but still stored). When paused, 'resume' button will appear so user can scroll to the bottom.
 * Resume button also displays number of lines not rendered (if any).
 * After scrolling to the bottom, all data not rendered yet will be rendered.
 *
 * User can use 'Top' button to scroll to the top and 'Bottom' button to scroll to the bottom.
 * There is also a switch, which can be used to change default 'follow' value.
 * When log viewer is following and new data are inputted, log viewer will automatically scroll to the bottom.
 *
 * See an example use {@link DemoPage}
 *
 * @example
 * ```tsx
 * <LogViewer data={logData} follow={false} />
 * ```
 *
 * @param isStatic - true for static variant if whole log is available at once, false for live variant for dynamically loaded log lines
 * @param heightOffset - offset for the responsive height for the LogViewer component
 * @param data - data log viewer will render
 */
export const LogViewer = ({ isStatic = false, data, heightOffset = 0, customActions }: ILogViewerProps) => {
  const logViewerRef = useRef<any>();

  // is log viewer currently following new data input?
  const { storageValue: isFollowing, storeToStorage: storeIsFollowing } = useStorage<boolean>({
    storageKey: StorageKeys.isLogViewerFollowingNewContent,
    initialValue: false,
  });

  // are lines wrapped?
  const { storageValue: areLinesWrapped, storeToStorage: storeAreLinesWrapped } = useStorage<boolean>({
    storageKey: StorageKeys.isLogViewerContentWrapped,
    initialValue: false,
  });

  // is log viewer paused? (data are still stored, but not rendered)
  const [isPaused, setIsPaused] = useState(true);

  return (
    <div className={css(!areLinesWrapped && styles['log-viewer__line--wrap-lines-off'])}>
      <LogViewerBase
        logViewerRef={logViewerRef}
        data={data}
        isStatic={isStatic}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isFollowing={isFollowing}
        areLinesWrapped={areLinesWrapped}
        toolbar={
          <LogViewerToolbar
            logViewerRef={logViewerRef}
            isStatic={isStatic}
            setIsPaused={setIsPaused}
            isFollowing={isFollowing}
            setIsFollowing={storeIsFollowing}
            areLinesWrapped={areLinesWrapped}
            setAreLinesWrapped={storeAreLinesWrapped}
            customActions={customActions}
          />
        }
        heightOffset={heightOffset}
      />
    </div>
  );
};
