import { Button, Checkbox, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { Fragment, ReactNode, memo } from 'react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface ILogViewerToolbarProps {
  logViewerRef: React.RefObject<any>;
  isStatic: boolean;
  setIsPaused: (value: boolean) => void;
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
  areLinesWrapped: boolean;
  setAreLinesWrapped: (value: boolean) => void;
  customActions?: ReactNode[];
}

export const LogViewerToolbar = memo(
  ({
    logViewerRef,
    isStatic,
    setIsPaused,
    isFollowing,
    setIsFollowing,
    areLinesWrapped,
    setAreLinesWrapped,
    customActions,
  }: ILogViewerToolbarProps) => (
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
                <TooltipWrapper tooltip="Scroll down automatically on new log lines input.">
                  <Checkbox
                    id="force-following-check"
                    label="Force following"
                    isChecked={isFollowing}
                    onChange={(_, checked) => {
                      setIsPaused(!checked);
                      setIsFollowing(checked);
                    }}
                  />
                </TooltipWrapper>
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
                setAreLinesWrapped(checked);
              }}
            />
          </ToolbarItem>
          {!!customActions?.length &&
            customActions.map((node, index) => (
              <Fragment key={index}>
                <ToolbarItem variant="separator" />
                <ToolbarItem alignSelf="center">{node}</ToolbarItem>
              </Fragment>
            ))}
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  )
);
