import { Alert } from '@patternfly/react-core';
import React from 'react';

import { RefreshStateCard } from 'components/EmptyStates/RefreshStateCard';
import { IDataContainer } from 'components/ServiceContainers/DataContainer';

export const ServiceContainerCreatingUpdating = ({ loading, error, children }: React.PropsWithChildren<IDataContainer>) => {
  if (loading) {
    return (
      <RefreshStateCard>
        <br />
        {children}
      </RefreshStateCard>
    );
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
