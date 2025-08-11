import { Button } from '@patternfly/react-core';
import { PauseIcon, PlayIcon } from '@patternfly/react-icons';

import styles from './LayoutControlButton.module.css';

interface ILayoutControlButtonProps {
  isLayoutRunning: boolean;
  layoutStart: () => void;
  layoutStop: () => void;
}

export const LayoutControlButton = ({ isLayoutRunning, layoutStart, layoutStop }: ILayoutControlButtonProps) => (
  <Button
    variant="primary"
    onClick={() => (isLayoutRunning ? layoutStop() : layoutStart())}
    className={styles['layout-control-button']}
    icon={isLayoutRunning ? <PauseIcon /> : <PlayIcon />}
  />
);
