import { Button } from '@patternfly/react-core';
import { OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { css } from '@patternfly/react-styles';
import { ReactNode, useEffect, useState } from 'react';

import styles from './LogViewer.module.css';

interface ILogViewerBaseProps {
  logViewerRef: React.RefObject<any>;
  data: string | string[];
  isStatic: boolean;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  isFollowing: boolean;
  areLinesWrapped: boolean;
  toolbar?: ReactNode;
}

interface IOnScrollProps {
  scrollOffsetToBottom: number;
  scrollUpdateWasRequested: boolean;
}

export const LogViewerBase = ({
  logViewerRef,
  data,
  toolbar,
  isStatic,
  isPaused,
  setIsPaused,
  isFollowing,
  areLinesWrapped,
}: ILogViewerBaseProps) => {
  // data that are actually rendered
  const [renderedData, setRenderedData] = useState(data);
  // if paused, how many lines were not rendered?
  const linesBehind = data.length - renderedData.length;

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
    <div className={css(!areLinesWrapped && styles['log-viewer__line--wrap-lines-off'])}>
      <LogViewerPF
        innerRef={logViewerRef}
        data={renderedData}
        onScroll={onScroll}
        toolbar={toolbar}
        footer={!isStatic && isPaused && !isFollowing && resumeButton}
        isTextWrapped={areLinesWrapped}
      />
    </div>
  );
};
