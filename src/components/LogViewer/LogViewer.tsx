import { Button, Switch, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { CaretDownIcon, CaretUpIcon, OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { useEffect, useRef, useState } from 'react';

interface ILogViewerProps {
  data: string | string[];
  follow: boolean;
}

export const LogViewer = ({ data, follow }: ILogViewerProps) => {
  const logViewerRef = useRef<any>();

  // data that are actually rendered
  const [renderedData, setRenderedData] = useState(data);
  // is log viewer currently following new data input?
  const [isFollowing, setIsFollowing] = useState<boolean>(follow);
  // is log viewer paused? (data are still stored, but not rendered)
  const [isPaused, setIsPaused] = useState(true);
  // count of rendered lines
  // is assigned to 'scrolToRow' only if log viewer is paused (so no automatic scrolling happens when paused)
  const [lineCount, setLineCount] = useState(0);
  // if paused, how many lines were not rendered?
  const [linesBehind, setLinesBehind] = useState(0);

  useEffect(() => {
    if (!isPaused && data.length > 0) {
      setLineCount(data.length);
      setRenderedData(data);
      logViewerRef?.current?.scrollToBottom();
    }
  }, [isPaused, data]);

  useEffect(() => {
    setLinesBehind(data.length - lineCount);
  }, [data.length, lineCount]);

  useEffect(() => {
    if (isFollowing) {
      setIsPaused(false);
    }
  }, [isFollowing, data]);

  const onScroll = ({ scrollOffsetToBottom, scrollDirection, scrollUpdateWasRequested }: any) => {
    if (!scrollUpdateWasRequested) {
      if (scrollOffsetToBottom > 0) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    }
  };

  const HeaderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Button
            onClick={() => {
              setIsPaused(true);
              logViewerRef?.current?.scrollTo(0, 0);
            }}
            variant="control"
            icon={<CaretUpIcon />}
          >
            Top
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            onClick={() => {
              setIsPaused(false);
            }}
            variant="control"
            icon={<CaretDownIcon />}
          >
            Bottom
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Switch
            label="Following"
            labelOff="Not Following"
            isChecked={isFollowing}
            onChange={(checked) => {
              setIsFollowing(checked);
            }}
          />
        </ToolbarItem>
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
      scrollToRow={!isPaused || isFollowing ? lineCount : 0}
      onScroll={onScroll}
      toolbar={<HeaderToolbar />}
      footer={isPaused && <FooterButton />}
    />
  );
};
