import { Button as ButtonPF, ButtonProps } from '@patternfly/react-core';

import { withProtection } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IButtonProps extends Omit<ButtonProps, 'isAriaDisabled'> {
  tooltip?: string;
}

export const Button = ({ tooltip, ...props }: IButtonProps) => (
  <TooltipWrapper tooltip={tooltip}>
    <span>
      <ButtonPF {...props} />
    </span>
  </TooltipWrapper>
);

export const ProtectedButton = withProtection(Button, 'tooltip');
