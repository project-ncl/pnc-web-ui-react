import { ButtonProps } from '@patternfly/react-core';
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
import { PropsWithChildren } from 'react';
import { Link } from 'react-router';

import { Button } from 'components/Button/Button';
import { withProtection } from 'components/ProtectedContent/ProtectedComponent';

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

export interface IActionButtonProps extends PropsWithChildren {
  iconType?: keyof typeof iconDictionary;
  variant: ButtonProps['variant'];
  link?: string;
  action?: React.MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
  isDisabled?: boolean;
}

/**
 * Represents a button component with a predefined icon.
 * Can also serve as a link (if link prop is specified).
 * Only either action or link prop should be specified.
 *
 * @param iconType - specifies the icon of the button (view typescript definition for all possible options)
 * @param variant - button style variant
 * @param link - optional prop if the button should serve as a link component (will redirect to the specified link)
 * @param action - function to perform on clicking the button
 * @param tooltip - optional tooltip text
 * @param isDisabled - whether the button is disabled
 * @param children - the inner components of the button (usually a textual description)
 */
export const ActionButton = ({ iconType, variant, link, action, tooltip, isDisabled, children }: IActionButtonProps) => (
  <Button
    variant={variant}
    size="sm"
    icon={iconType ? iconDictionary[iconType] : null}
    component={link ? (props: any) => <Link {...props} to={link} /> : undefined}
    onClick={action}
    tooltip={tooltip}
    isDisabled={isDisabled}
  >
    {children}
  </Button>
);

export const ProtectedActionButton = withProtection(ActionButton, 'tooltip');
