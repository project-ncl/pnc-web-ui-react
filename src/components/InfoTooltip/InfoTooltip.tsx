import { Popover, PopoverProps } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { ReactNode } from 'react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isString } from 'utils/entityRecognition';

import styles from './InfoTooltip.module.css';

interface IInfoTooltipProps {
  tooltip: ReactNode;
  tooltipPosition?: PopoverProps['position'];
}

export const InfoTooltip = ({ tooltip, tooltipPosition }: IInfoTooltipProps) => (
  <>
    {isString(tooltip) ? (
      <TooltipWrapper tooltip={tooltip}>
        <InfoTooltipIcon />
      </TooltipWrapper>
    ) : (
      <Popover bodyContent={tooltip} showClose={false} enableFlip={false} position={tooltipPosition}>
        <InfoTooltipIcon isClickable />
      </Popover>
    )}
  </>
);

interface IInfoTooltipIconProps {
  isClickable?: boolean;
}

const InfoTooltipIcon = ({ isClickable = false }: IInfoTooltipIconProps) => (
  <span className={css(styles['info-tooltip__icon'], isClickable && styles['info-tooltip__icon--clickable'])}>
    <InfoCircleIcon />
  </span>
);
