import { Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface ITooltipWrapperProps {
  tooltip?: string;
}
/**
 * Tooltip Wrapper to make any component (like icon) to become a tooltip component.
 *
 * @param tooltip - the tooltip to be displayed
 * @param children - the tooltip handler, by default <InfoCircleIcon />
 */
export const TooltipWrapper = ({ tooltip, children }: React.PropsWithChildren<ITooltipWrapperProps>) =>
  tooltip ? (
    <Tooltip removeFindDomNode content={tooltip}>
      <> {children ? <>{children}</> : <InfoCircleIcon />}</>
    </Tooltip>
  ) : (
    <> {children ? <>{children}</> : null}</>
  );
