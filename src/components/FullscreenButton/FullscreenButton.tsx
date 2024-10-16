import { Button } from '@patternfly/react-core';
import { CompressIcon, ExpandArrowsAltIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { MutableRefObject } from 'react';

import { useFullscreen } from 'hooks/useFullscreen';

import { uiLogger } from 'services/uiLogger';

import styles from './FullscreenButton.module.css';

const toggleFullScreen = (containerRef: MutableRefObject<HTMLDivElement | null>) => {
  if (document.fullscreenElement !== containerRef?.current) {
    containerRef.current?.requestFullscreen().catch((err) => {
      uiLogger.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
};

interface IFullscreenButtonProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  position?: 'relative' | 'bottom-left';
  isPlain?: boolean;
  hasTitle?: boolean;
}

export const FullscreenButton = ({
  containerRef,
  position = 'relative',
  isPlain = false,
  hasTitle = false,
}: IFullscreenButtonProps) => {
  const { isFullscreen } = useFullscreen();

  return (
    <Button
      variant={isPlain ? 'plain' : 'primary'}
      className={css(position === 'bottom-left' && styles['fullscreen-button--bottom-left-position'])}
      onClick={() => toggleFullScreen(containerRef)}
      style={isPlain ? { padding: 0 } : undefined}
    >
      {isFullscreen ? <CompressIcon /> : <ExpandArrowsAltIcon />} {hasTitle && (isFullscreen ? 'Collapse' : 'Expand')}
    </Button>
  );
};
