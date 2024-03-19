import { Label, LabelProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface ITooltipLabelProps {
  tooltip: string;
  margin?: boolean;
  color?: LabelProps['color'];
  isCompact?: LabelProps['isCompact'];
}

export const TooltipLabel = ({
  tooltip,
  margin = true,
  color = 'grey',
  isCompact = true,
  children,
}: PropsWithChildren<ITooltipLabelProps>) => (
  <div className={css('inline-block', margin && 'm-l-5 m-r-5')}>
    <TooltipWrapper tooltip={tooltip}>
      <Label isCompact={isCompact} color={color}>
        {children}
      </Label>
    </TooltipWrapper>
  </div>
);
