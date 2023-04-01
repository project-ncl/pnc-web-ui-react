import { Button } from '@patternfly/react-core';
import { CompressIcon, ExpandArrowsAltIcon } from '@patternfly/react-icons';
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
}

export const FullscreenButton = ({ containerRef }: IFullscreenButtonProps) => {
  const { isFullscreen } = useFullscreen();

  return (
    <Button className={styles['fullscreen-button']} onClick={() => toggleFullScreen(containerRef)}>
      {isFullscreen ? <CompressIcon /> : <ExpandArrowsAltIcon />}
    </Button>
  );
};
