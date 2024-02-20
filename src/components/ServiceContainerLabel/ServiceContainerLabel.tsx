import { Label } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PropsWithChildren } from 'react';

import { IServiceContainerState, TServiceData } from 'hooks/useServiceContainer';

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IServiceContainerLabelProps<T extends TServiceData> {
  loading: IServiceContainerState<T>['loading'];
  error: IServiceContainerState<T>['error'];
  title: string;
}

export const ServiceContainerLabel = <T extends TServiceData>({
  loading,
  error,
  title,
  children,
}: PropsWithChildren<IServiceContainerLabelProps<T>>) => {
  const contents = error ? <ExclamationCircleIcon /> : loading ? <LoadingSpinner isInline /> : children;

  return (
    <TooltipWrapper tooltip={`${error && 'Error when loading'} ${title}`}>
      <Label color={error ? 'red' : 'grey'}>{contents}</Label>
    </TooltipWrapper>
  );
};
