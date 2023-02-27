import { Alert } from '@patternfly/react-core';
import React from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { RefreshStateCard } from 'components/EmptyStates/RefreshStateCard';
import { IServiceContainerProps, ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface IServiceContainerCreatingUpdatingProps extends IServiceContainerProps {
  title?: string;
  /**
   * Typically only edit pages pass serviceContainerLoading to handle initial data states (like loading or error)
   */
  serviceContainerLoading?: IServiceContainer;
}

export const ServiceContainerCreatingUpdating = ({
  loading,
  error,
  title,
  serviceContainerLoading,
  children,
}: React.PropsWithChildren<IServiceContainerCreatingUpdatingProps>) => {
  // Edit pages only
  if (serviceContainerLoading && (serviceContainerLoading.loading || serviceContainerLoading.error)) {
    // no child content is needed, only initial data loading states are handled, once data is loaded, edit page content is displayed instead
    return <ServiceContainerLoading {...serviceContainerLoading} title={`edit ${title}`} />;
  }

  // Edit + Create pages

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
