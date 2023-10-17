import { ReactNode } from 'react';

import { DataValues, IServiceContainerState, TServiceData, areServiceDataPaginated } from 'hooks/useServiceContainer';

import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';
import { ErrorStateCard } from 'components/StateCard/ErrorStateCard';
import { LoadingStateCard } from 'components/StateCard/LoadingStateCard';
import { RefreshStateCard } from 'components/StateCard/RefreshStateCard';

export interface IServiceContainerProps<T extends TServiceData> {
  data: IServiceContainerState<T>['data'];
  loading: IServiceContainerState<T>['loading'];
  error: IServiceContainerState<T>['error'];
}

interface IServiceContainerLoadingProps<T extends TServiceData> extends IServiceContainerProps<T> {
  title: string;
  loadingStateDelayMs?: number; // in milliseconds
  hasSkeleton?: boolean;
  variant?: 'block' | 'inline' | 'icon';
  notYetContent?: ReactNode;
  allowEmptyData?: boolean;
}

/**
 * Container component handling loading, error and empty data states. If one of those states
 * is valid then proper state component is displayed instead of the (children) component displaying
 * real data. See also {@link useServiceContainer}.
 *
 * @example
 * ```ts
 * // ServiceContainerLoading component can be typically used together with useServiceContainer hook:
 * const serviceContainer = useServiceContainer(() => projectApi.getProjects());
 * <ServiceContainerLoading {...serviceContainer} title="Projects list">
 *   <ProjectsList projects={serviceContainer.data} />
 * </ServiceContainerLoading>
 * ```
 *
 * @param data - Real data to be displayed when its fully loaded
 * @param loading - True if a request is pending, false when a request is successfully finished or when a request resulted in error
 * @param error - Error description when data loading was not successful
 * @param loadingStateDelayMs - Waiting time before loading component gets rendered (in milliseconds)
 * @param hasSkeleton - Display skeleton in loading state
 * @param variant - Style variant. Defaults to 'block'
 * @param notYetContent - Custom content to be displayed when service was not executed yet, typically used when service is executed manually after some user event (for example click), not automatically after rendering
 * @param allowEmptyData - Allows empty data even when no error ocurred
 * @param children - React children property
 */
export const ServiceContainerLoading = <T extends TServiceData>({
  data,
  loading,
  error,
  title,
  loadingStateDelayMs,
  hasSkeleton = false,
  variant = 'block',
  notYetContent,
  allowEmptyData = false,
  children,
}: React.PropsWithChildren<IServiceContainerLoadingProps<T>>) => {
  // Initial loading: display Loading card when loading and no previous data is available (the component is rendered for the first time)
  if (loading && !data)
    return (
      <LoadingStateCard delayMs={loadingStateDelayMs} title={title} hasSkeleton={hasSkeleton} isInline={variant !== 'block'} />
    );

  // Refresh loading: keep previous real data with loading indicator when loading new data and previous real data is available
  // (the component was rendered at some point before)
  //  - for example: when page index is changed from page 1 to page 2
  //  - this will make UI more smooth and it prevents flickering user experience
  if (loading && data) return <RefreshStateCard isInline={variant !== 'block'}>{children}</RefreshStateCard>;

  // Error state: display Error card when error
  if (error) return <ErrorStateCard title={title} error={error} variant={variant} />;

  // Service not executed yet
  // When service is executed automatically after rendering, then null prevents flickering experience before other states are displayed
  if (data === DataValues.notYetData) return notYetContent ? <>{notYetContent}</> : null;

  if (!data && allowEmptyData) return <EmptyStateCard title={title} />;

  // Invalid state, Error state should be triggered before this
  if (!data) throw new Error('ServiceContainerLoading invalid state: when no data are available, error state should be returned');

  // Empty state: display Empty card when
  //  - request was successfully finished,
  //  - content property is available (= content property means table data with pagination are expected),
  //  - but no items are available
  //  - style variant is block
  if (areServiceDataPaginated(data) && !data.content?.length && variant === 'block') return <EmptyStateCard title={title} />;

  // Empty state: display Empty card when
  //  - request was successfully finished,
  //  - data is array
  //  - but no items are available
  //
  // Used for example for kafka service.
  if (Array.isArray(data) && !data.length) return <EmptyStateCard title={title} />;

  // Real data: display real data when it's loaded successfully and it's not empty (or is empty and inline)
  // children are evaluated even if not rendered, see https://stackoverflow.com/q/71398045
  return <>{children}</>;
};
