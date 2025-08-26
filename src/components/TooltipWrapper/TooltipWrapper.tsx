import { Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { ReactNode } from 'react';

import styles from './TooltipWrapper.module.css';

interface ITooltipWrapperProps {
  tooltip?: ReactNode;
  isVisible?: boolean;
}
/**
 * Tooltip Wrapper to make any component (like icon) to become a tooltip component.
 *
 * @param tooltip - the tooltip to be displayed
 * @param isVisible - set the tooltip visibility programmatically
 * @param children - the tooltip handler, by default <InfoCircleIcon />
 */
export const TooltipWrapper = ({ tooltip, isVisible, children }: React.PropsWithChildren<ITooltipWrapperProps>) =>
  tooltip ? (
    <Tooltip content={tooltip} isVisible={isVisible} className={styles['tooltip-wrapper__tooltip']}>
      <> {children ? <>{children}</> : <InfoCircleIcon />}</>
    </Tooltip>
  ) : (
    <> {children ? <>{children}</> : null}</>
  );
