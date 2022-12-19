import { Alert } from '@patternfly/react-core';
import React from 'react';

import { RefreshStateCard } from 'components/EmptyStates/RefreshStateCard';
import { IServiceContainerProps } from 'components/ServiceContainers/ServiceContainerLoading';

export const ServiceContainerCreatingUpdating = ({
  loading,
  error,
  children,
}: React.PropsWithChildren<IServiceContainerProps>) => {
  if (loading) {
    return <RefreshStateCard>{children}</RefreshStateCard>;
  }

  if (error) {
    return (
      <>
        <Alert variant="danger" isInline title={error} />
        {children}
      </>
    );
  }

  return <>{children}</>;
};
