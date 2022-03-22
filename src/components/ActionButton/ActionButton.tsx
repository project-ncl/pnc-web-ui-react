import { Button, Flex } from '@patternfly/react-core';
import { TrashIcon, PencilAltIcon, FileIcon } from '@patternfly/react-icons';

import styles from './ActionButton.module.css';

const actionIcons = {
  create: <FileIcon />,
  edit: <PencilAltIcon />,
  delete: <TrashIcon />,
};

interface IActionButton {
  actionType: 'create' | 'edit' | 'delete';
}

export const ActionButton = ({ actionType }: IActionButton) => {
  return (
    <Button variant="tertiary" isSmall className={styles['action-button']} icon={actionIcons[actionType]}>
      {actionType}
    </Button>
  );
};

interface IActionHeader extends IActionButton {
  text: string;
}

export const ActionHeader = ({ text, ...actionButtonProps }: IActionHeader) => {
  return (
    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      {text} <ActionButton {...actionButtonProps} />
    </Flex>
  );
};
