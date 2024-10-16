import { Button } from '@patternfly/react-core';
import { OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { css } from '@patternfly/react-styles';
import { ReactNode, memo, useEffect, useState } from 'react';

import { useFullscreen } from 'hooks/useFullscreen';

import styles from './LogViewer.module.css';

const HEIGHT_DEFAULT_OFFSET = 300;

interface ILogViewerBaseProps {
  logViewerRef: React.RefObject<any>;
  data: string | string[];
  isStatic: boolean;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  isFollowing: boolean;
  areLinesWrapped: boolean;
  toolbar?: ReactNode;
  heightOffset?: number;
}

interface IOnScrollProps {
  scrollOffsetToBottom: number;
  scrollUpdateWasRequested: boolean;
}

export const LogViewerBase = memo(
  ({
    logViewerRef,
    data,
    toolbar,
    isStatic,
    isPaused,
    setIsPaused,
    isFollowing,
    areLinesWrapped,
    heightOffset = 0,
  }: ILogViewerBaseProps) => {
    // data that are actually rendered
    const [renderedData, setRenderedData] = useState(data);
    // if paused, how many lines were not rendered?
    const linesBehind = data.length - renderedData.length;

    const { isFullscreen } = useFullscreen();
    const [height, setHeight] = useState<number>(window.innerHeight - HEIGHT_DEFAULT_OFFSET + heightOffset);

    useEffect(() => {
      if ((!isPaused || isFollowing || isStatic) && data.length > 0) {
        setRenderedData(data);
      }
    }, [data, isPaused, isFollowing, isStatic]);

    useEffect(() => {
      logViewerRef.current?.scrollToBottom();
    }, [renderedData.length, logViewerRef]);

    useEffect(() => {
      // scroll to the bottom on init (useful for static variant)
      const timeoutId = setTimeout(() => {
        logViewerRef.current?.scrollToBottom();
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [logViewerRef]);

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

    const onScroll = ({ scrollOffsetToBottom, scrollUpdateWasRequested }: IOnScrollProps) => {
      if (!scrollUpdateWasRequested) {
        const offsetFromBottomPauseThreshold = 5;
        setIsPaused(scrollOffsetToBottom > offsetFromBottomPauseThreshold);
      }
    };

    const resumeButton = (
      <Button
        onClick={() => {
          logViewerRef.current?.scrollToBottom();
          setIsPaused(false);
        }}
        isBlock
        icon={<OutlinedPlayCircleIcon />}
      >
        resume {linesBehind === 0 ? null : `and show ${linesBehind} lines`}
      </Button>
    );

    return (
      <div
        className={css(
          !areLinesWrapped && styles['log-viewer__line--wrap-lines-off'],
          isFullscreen && styles['log-viewer-base--fullscreen']
        )}
      >
        <LogViewerPF
          innerRef={logViewerRef}
          data={renderedData}
          onScroll={onScroll}
          toolbar={toolbar}
          footer={!isStatic && isPaused && !isFollowing && resumeButton}
          isTextWrapped={areLinesWrapped}
          height={isFullscreen ? '100%' : height}
        />
      </div>
    );
  }
);
