import { Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface ITooltipText {
  tooltip: string;
}

export const TooltipText = ({ tooltip, children }: React.PropsWithChildren<ITooltipText>) => {
  return (
    <span>
      {children}{' '}
      <Tooltip removeFindDomNode content={tooltip}>
        <InfoCircleIcon />
      </Tooltip>
    </span>
  );
};
