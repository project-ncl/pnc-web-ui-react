import { Popover, PopoverProps } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { ReactNode } from 'react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isString } from 'utils/entityRecognition';

import styles from './InfoTooltip.module.css';

interface IInfoTooltipProps {
  tooltip: ReactNode;
  color?: 'black' | 'blue';
  tooltipPosition?: PopoverProps['position'];
}

export const InfoTooltip = ({ tooltip, color = 'black', tooltipPosition }: IInfoTooltipProps) => (
  <>
    {isString(tooltip) ? (
      <TooltipWrapper tooltip={tooltip}>
        <TooltipIcon color={color} />
      </TooltipWrapper>
    ) : (
      <Popover bodyContent={tooltip} showClose={false} enableFlip={false} position={tooltipPosition}>
        <TooltipIcon color={color} isClickable />
      </Popover>
    )}
  </>
);

interface ITooltipIconProps {
  color: 'black' | 'blue';
  isClickable?: boolean;
}

const TooltipIcon = ({ color, isClickable = false }: ITooltipIconProps) => (
  <span
    className={css(
      styles['tooltip-icon'],
      color === 'blue' && styles['tooltip-icon--blue'],
      isClickable && styles['tooltip-info--clickable']
    )}
  >
    <InfoCircleIcon />
  </span>
);
