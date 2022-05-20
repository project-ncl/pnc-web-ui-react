import { Button } from '@patternfly/react-core';
import { TrashIcon, PencilAltIcon, FileIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

import styles from './ActionButton.module.css';

const actionIcons = {
  create: <FileIcon />,
  edit: <PencilAltIcon />,
  delete: <TrashIcon />,
};

export interface IActionButtonProps {
  actionType: 'create' | 'edit' | 'delete';
  link?: string;
  action?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Represents a button component with a predefined icon.
 * Can also serve as a Link (if link prop is specified).
 *
 * @param actionType - specifies the icon of the button, possible options are 'create' | 'edit' | 'delete'
 * @param link - optional prop if the button should serve as a Link component (will redirect to the specified link)
 * @param action - function to perform on clicking the button
 */
export const ActionButton = ({ actionType, link, action }: IActionButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      isSmall
      className={styles['action-button']}
      icon={actionIcons[actionType]}
      onClick={link ? () => navigate(link, { replace: true }) : action}
    >
      {actionType}
    </Button>
  );
};
