import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

import { IconWrapper } from 'components/IconWrapper/IconWrapper';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IWarningIconProps {
  tooltip?: string;
}

export const WarningIcon = ({ tooltip }: IWarningIconProps) => (
  <TooltipWrapper tooltip={tooltip}>
    <IconWrapper variant="small">
      <Icon status="warning">
        <ExclamationTriangleIcon />
      </Icon>
    </IconWrapper>
  </TooltipWrapper>
);
