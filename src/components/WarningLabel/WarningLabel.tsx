import { Label, LabelProps } from '@patternfly/react-core';

import { WarningIcon } from 'components/Icons/WarningIcon';

interface IWarningLabelProps extends Exclude<LabelProps, 'color' | 'icon'> {
  hasIcon?: boolean;
}

export const WarningLabel = ({ hasIcon = false, children, ...otherProps }: IWarningLabelProps) => (
  <Label color="gold" icon={hasIcon && <WarningIcon />} {...otherProps}>
    {children}
  </Label>
);
