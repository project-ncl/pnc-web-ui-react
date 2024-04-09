import { Label, LabelProps } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

interface IWarningLabelProps extends Exclude<LabelProps, 'color' | 'icon'> {
  hasIcon?: boolean;
}

export const WarningLabel = ({ hasIcon = false, children, ...otherProps }: IWarningLabelProps) => (
  <Label color="gold" icon={hasIcon && <ExclamationTriangleIcon />} {...otherProps}>
    {children}
  </Label>
);
