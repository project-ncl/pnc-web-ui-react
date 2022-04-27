import { Button } from '@patternfly/react-core';
import { TrashIcon, PencilAltIcon, FileIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import styles from './ActionButton.module.css';

const actionIcons = {
  create: <FileIcon />,
  edit: <PencilAltIcon />,
  delete: <TrashIcon />,
};

export interface IActionButtonProps {
  actionType: 'create' | 'edit' | 'delete';
  link?: string;
}

interface IConditionalLinkWrapperProps {
  link?: string;
  children: React.ReactElement;
}
const ConditionalLinkWrapper = ({ link, children }: IConditionalLinkWrapperProps) =>
  link ? <Link to={link}>{children}</Link> : children;

/**
 * Represents a button component with a predefined icon.
 * Can also serve as a Link (if link prop is specified).
 *
 * @param actionType - specifies the icon of the button, possible options are 'create' | 'edit' | 'delete'
 * @param link - optional prop if the button should serve as a Link component (will redirect to the specified link)
 */
export const ActionButton = ({ actionType, link }: IActionButtonProps) => (
  <ConditionalLinkWrapper link={link}>
    <Button variant="secondary" isSmall className={styles['action-button']} icon={actionIcons[actionType]}>
      {actionType}
    </Button>
  </ConditionalLinkWrapper>
);
