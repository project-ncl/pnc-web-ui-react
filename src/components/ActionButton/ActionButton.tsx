import { Button } from '@patternfly/react-core';
import { TrashIcon, PencilAltIcon, FileIcon } from '@patternfly/react-icons';

import styles from './ActionButton.module.css';

const actionIcons = {
  create: <FileIcon />,
  edit: <PencilAltIcon />,
  delete: <TrashIcon />,
};

export interface IActionButtonProps {
  actionType: 'create' | 'edit' | 'delete';
}

export const ActionButton = ({ actionType }: IActionButtonProps) => (
  <Button variant="tertiary" isSmall className={styles['action-button']} icon={actionIcons[actionType]}>
    {actionType}
  </Button>
);
