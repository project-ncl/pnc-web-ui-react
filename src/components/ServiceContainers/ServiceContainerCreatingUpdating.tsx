import { Alert } from '@patternfly/react-core';
import React from 'react';

import { IDataContainer } from 'hooks/DataContainer/DataContainer';

import { RefreshStateCard } from 'components/EmptyStates/RefreshStateCard';

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
