import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './SelectedNodesInfo.module.css';

interface ISelectedNodesInfoProps {
  selectedNodesCount: number;
  unselectAllNodes: () => void;
}

export const SelectedNodesInfo = ({ selectedNodesCount, unselectAllNodes }: ISelectedNodesInfoProps) => (
  <div className={styles['selected-nodes-info']}>
    {`${selectedNodesCount} node${selectedNodesCount !== 1 ? 's' : ''} selected`}
    <Button
      variant="plain"
      hasNoPadding
      onClick={unselectAllNodes}
      className={styles['unselect-nodes-button']}
      icon={
        <TooltipWrapper tooltip="Unselect all nodes.">
          <TimesIcon />
        </TooltipWrapper>
      }
    />
  </div>
);
