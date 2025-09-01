import { Label, LabelProps } from '@patternfly/react-core';

interface IWarningLabelProps extends Exclude<LabelProps, 'color' | 'icon' | 'status'> {}

export const WarningLabel = ({ children, ...otherProps }: IWarningLabelProps) => (
  <Label color="yellow" status="warning" {...otherProps}>
    {children}
  </Label>
);
