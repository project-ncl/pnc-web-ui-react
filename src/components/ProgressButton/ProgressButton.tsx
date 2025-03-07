import { Button, ButtonProps } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IProgressButtonProps {
  onClick?: () => void;
  serviceContainer: IServiceContainerState<Object>;
  variant?: ButtonProps['variant'];
  icon?: ReactNode;
  isDisabled?: boolean;
  isSmall?: boolean;
  isLarge?: boolean;
  className?: string;
  delayMs?: number;
  disabledTooltip?: string;
}

/**
 * Button executing an action and displaying its (loading and error) states.
 *
 * @param children - Button title
 * @param onClick - Callback to execute the action with
 * @param serviceContainer - Service container of the action service
 * @param variant - Button style variant
 * @param icon - Button title icon
 * @param isDisabled - Whether the button is disabled
 * @param isSmall - Small button styling
 * @param isLarge - Large button styling
 * @param className - CSS class
 * @param delayMs - Delay after which the loading spinner is displayed
 * @param disabledTooltip - The tooltip message to be displayed when button is disabled
 */
export const ProgressButton = ({
  children,
  onClick,
  serviceContainer,
  variant = 'primary',
  icon,
  isDisabled,
  isSmall,
  isLarge,
  className,
  delayMs = 200,
  disabledTooltip,
}: PropsWithChildren<IProgressButtonProps>) => {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const isErrorState = serviceContainer.error && !serviceContainer.loading;

  if (!isTooltipVisible && isErrorState) {
    setIsTooltipVisible(true);
  }
  if (isTooltipVisible && !isErrorState) {
    setIsTooltipVisible(false);
  }

  useEffect(() => {
    if (serviceContainer.loading) {
      setShowLoadingSpinner(!delayMs);
      if (delayMs) {
        const timer = setTimeout(() => setShowLoadingSpinner(true), delayMs);
        return () => clearTimeout(timer);
      }
    }
  }, [delayMs, serviceContainer.loading]);

  const combinedTooltip =
    serviceContainer.error || disabledTooltip ? (
      <>
        {serviceContainer.error && <div>{serviceContainer.error}</div>}
        {serviceContainer.error && disabledTooltip && <br />}
        {disabledTooltip && <div>{disabledTooltip}</div>}
      </>
    ) : undefined;

  return (
    <TooltipWrapper tooltip={combinedTooltip} isVisible={isTooltipVisible}>
      <Button
        onClick={onClick}
        variant={isErrorState ? 'danger' : variant}
        icon={isErrorState ? <ExclamationCircleIcon /> : (!showLoadingSpinner || !serviceContainer.loading) && icon}
        isLoading={showLoadingSpinner && serviceContainer.loading}
        isAriaDisabled={isDisabled || serviceContainer.loading}
        size={isSmall ? 'sm' : isLarge ? 'lg' : 'default'}
        className={className}
      >
        {children}
      </Button>
    </TooltipWrapper>
  );
};
