import { Label, LabelProps } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PropsWithChildren } from 'react';

import { IServiceContainerState, TServiceData } from 'hooks/useServiceContainer';

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IServiceContainerLabelProps<T extends TServiceData> extends PropsWithChildren, Omit<LabelProps, 'data'> {
  loading: IServiceContainerState<T>['loading'];
  error: IServiceContainerState<T>['error'];
  title: string;
  tooltip?: string;
}

export const ServiceContainerLabel = <T extends TServiceData>({
  loading,
  error,
  title,
  tooltip,
  color,
  children,
  ...labelProps
}: PropsWithChildren<IServiceContainerLabelProps<T>>) => {
  const contents = error ? <ExclamationCircleIcon /> : loading ? <LoadingSpinner isInline /> : children;

  return (
    <TooltipWrapper tooltip={error || !tooltip ? `${error && 'Error when loading'} ${title}${error && `. ${error}`}` : tooltip}>
      <Label color={error ? 'red' : color} {...labelProps}>
        {contents}
      </Label>
    </TooltipWrapper>
  );
};
