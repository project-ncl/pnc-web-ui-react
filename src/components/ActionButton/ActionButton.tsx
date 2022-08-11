import { Button } from '@patternfly/react-core';
import {
  CopyIcon,
  ExternalLinkAltIcon,
  FileIcon,
  FlagIcon,
  LockIcon,
  PencilAltIcon,
  TagIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const iconDictionary = {
  create: <FileIcon />,
  edit: <PencilAltIcon />,
  delete: <TrashIcon />,
  clone: <CopyIcon />,
  quality: <TagIcon />,
  external: <ExternalLinkAltIcon />,
  close: <LockIcon />,
  mark: <FlagIcon />,
} as const;

export interface IActionButtonProps {
  iconType?: keyof typeof iconDictionary;
  link?: string;
  action?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Represents a button component with a predefined icon.
 * Can also serve as a link (if link prop is specified).
 * Only either action or link prop should be specified.
 * Most often will be used together with SectionHeader.
 *
 * @param iconType - specifies the icon of the button (view typescript definition for all possible options)
 * @param link - optional prop if the button should serve as a link component (will redirect to the specified link)
 * @param action - function to perform on clicking the button
 * @param children - the inner components of the button (usually a textual description)
 */
export const ActionButton = ({ iconType, link, action, children }: React.PropsWithChildren<IActionButtonProps>) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      isSmall
      icon={iconType ? iconDictionary[iconType] : null}
      onClick={link ? () => navigate(link) : action}
    >
      {children}
    </Button>
  );
};
