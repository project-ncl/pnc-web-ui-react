import { Button } from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';

interface IRemoveItemButtonProps {
  onRemove: () => void;
}

export const RemoveItemButton = ({ onRemove }: IRemoveItemButtonProps) => (
  <Button variant="plain" icon={<TimesCircleIcon />} onClick={onRemove} size="sm" isInline />
);
