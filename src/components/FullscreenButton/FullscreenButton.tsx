import { Button } from '@patternfly/react-core';
import { CompressIcon, ExpandArrowsAltIcon } from '@patternfly/react-icons';
import { MutableRefObject, useEffect, useState } from 'react';

import styles from './FullscreenButton.module.css';

const toggleFullScreen = (containerRef: MutableRefObject<HTMLDivElement | null>) => {
  if (document.fullscreenElement !== containerRef?.current) {
    containerRef.current?.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

interface IFullscreenButtonProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const FullscreenButton = ({ containerRef }: IFullscreenButtonProps) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const onFullscrenChange = () => setIsFullScreen((state) => !state);
    document.addEventListener('fullscreenchange', onFullscrenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscrenChange);
  }, []);

  return (
    <Button className={styles['fullscreen-button']} onClick={() => toggleFullScreen(containerRef)}>
      {isFullScreen ? <CompressIcon /> : <ExpandArrowsAltIcon />}
    </Button>
  );
};
