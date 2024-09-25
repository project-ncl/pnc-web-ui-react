import { Button, Checkbox, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon, OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { StorageKeys, useStorage } from 'hooks/useStorage';

interface ILogViewerProps {
  isStatic?: boolean;
  data: string | string[];
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
 * @param data - data log viewer will render
 */
export const LogViewer = ({ isStatic = false, data, customActions }: ILogViewerProps) => {
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

  // data that are actually rendered
  const [renderedData, setRenderedData] = useState(data);
  // is log viewer paused? (data are still stored, but not rendered)
  const [isPaused, setIsPaused] = useState(true);
  // if paused, how many lines were not rendered?
  const linesBehind = data.length - renderedData.length;

  useEffect(() => {
    if ((!isPaused || isStatic) && data.length > 0) {
      setRenderedData(data);
    }
  }, [data, isPaused, isStatic]);

  useEffect(() => {
    if (!isPaused || isStatic) {
      logViewerRef.current?.scrollToBottom();
    }
  }, [renderedData.length, isPaused, isStatic]);

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
                if (logViewerRef.current?.state.scrollOffset) {
                  setIsPaused(true);
                  logViewerRef.current.scrollTo(0, 0);
                }
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
                setIsPaused(false);
                logViewerRef.current?.scrollToBottom();
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
                    setIsPaused(false);
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
    <Button onClick={() => setIsPaused(false)} isBlock icon={<OutlinedPlayCircleIcon />}>
      resume {linesBehind === 0 ? null : `and show ${linesBehind} lines`}
    </Button>
  );

  return (
    <LogViewerPF
      innerRef={logViewerRef}
      data={renderedData}
      onScroll={onScroll}
      toolbar={<HeaderToolbar />}
      footer={isPaused && !isFollowing && <FooterButton />}
      isTextWrapped={areLinesWrapped}
    />
  );
};
