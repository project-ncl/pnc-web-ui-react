import { Button, Checkbox, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon, OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { css } from '@patternfly/react-styles';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { StorageKeys, useStorage } from 'hooks/useStorage';

import styles from './LogViewer.module.css';

const HEIGHT_DEFAULT_OFFSET = 300;

interface ILogViewerProps {
  isStatic?: boolean;
  data: string | string[];
  heightOffset?: number;
  customActions?: ReactNode[];
}

interface IOnScrollProps {
  scrollOffsetToBottom: number;
  scrollUpdateWasRequested: boolean;
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

  const [height, setHeight] = useState<number>(window.innerHeight - HEIGHT_DEFAULT_OFFSET + heightOffset);

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

  // data that are actually rendered
  const [renderedData, setRenderedData] = useState(data);
  // is log viewer paused? (data are still stored, but not rendered)
  const [isPaused, setIsPaused] = useState(true);
  // if paused, how many lines were not rendered?
  const linesBehind = data.length - renderedData.length;

  useEffect(() => {
    const updateHeight = () => {
      const calculatedHeight = window.innerHeight - HEIGHT_DEFAULT_OFFSET + heightOffset;
      setHeight(calculatedHeight);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [heightOffset]);

  useEffect(() => {
    if ((!isPaused || isFollowing || isStatic) && data.length > 0) {
      setRenderedData(data);
    }
  }, [data, isPaused, isFollowing, isStatic]);

  useEffect(() => {
    logViewerRef.current?.scrollToBottom();
  }, [renderedData.length]);

  useEffect(() => {
    // scroll to the bottom on init (useful for static variant)
    const timeoutId = setTimeout(() => {
      logViewerRef.current?.scrollToBottom();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const onScroll = ({ scrollOffsetToBottom, scrollUpdateWasRequested }: IOnScrollProps) => {
    if (!scrollUpdateWasRequested) {
      const offsetFromBottomPauseThreshold = 5;
      setIsPaused(scrollOffsetToBottom > offsetFromBottomPauseThreshold);
    }
  };

  const HeaderToolbar = () => (
    <Toolbar>
      <ToolbarContent alignItems="center">
        <ToolbarGroup>
          <ToolbarItem>
            <Button
              onClick={() => {
                logViewerRef.current?.scrollTo(0, 0);
                setIsPaused(true);
              }}
              variant="control"
              icon={<LongArrowAltUpIcon />}
            >
              Top
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button
              onClick={() => {
                logViewerRef.current?.scrollToBottom();
                setIsPaused(false);
              }}
              variant="control"
              icon={<LongArrowAltDownIcon />}
            >
              Bottom
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignRight' }}>
          {!isStatic && (
            <>
              <ToolbarItem alignSelf="center">
                <Checkbox
                  id="force-following-check"
                  label="Force following"
                  isChecked={isFollowing}
                  onChange={(_, checked) => {
                    setIsPaused(!checked);
                    storeIsFollowing(checked);
                  }}
                />
              </ToolbarItem>
              <ToolbarItem variant="separator" />
            </>
          )}
          <ToolbarItem alignSelf="center">
            <Checkbox
              id="wrap-lines-check"
              label="Wrap lines"
              isChecked={areLinesWrapped}
              onChange={(_, checked) => {
                storeAreLinesWrapped(checked);
              }}
            />
          </ToolbarItem>
          {!!customActions?.length &&
            customActions.map((node, index) => (
              <>
                <ToolbarItem variant="separator" />
                <ToolbarItem key={index} alignSelf="center">
                  {node}
                </ToolbarItem>
              </>
            ))}
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const FooterButton = () => (
    <Button
      onClick={() => {
        logViewerRef.current.scrollToBottom();
        setIsPaused(false);
      }}
      isBlock
      icon={<OutlinedPlayCircleIcon />}
    >
      resume {linesBehind === 0 ? null : `and show ${linesBehind} lines`}
    </Button>
  );

  return (
    <div className={css(!areLinesWrapped && styles['log-viewer__line--wrap-lines-off'])}>
      <LogViewerPF
        innerRef={logViewerRef}
        data={renderedData}
        onScroll={onScroll}
        toolbar={<HeaderToolbar />}
        footer={!isStatic && isPaused && !isFollowing && <FooterButton />}
        isTextWrapped={areLinesWrapped}
        height={height}
      />
    </div>
  );
};
