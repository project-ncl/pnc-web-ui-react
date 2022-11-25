import { EmptyStateCard } from 'components/EmptyStates/EmptyStateCard';
import { ErrorStateCard } from 'components/EmptyStates/ErrorStateCard';
import { LoadingStateCard } from 'components/EmptyStates/LoadingStateCard';
import { RefreshStateCard } from 'components/EmptyStates/RefreshStateCard';

export interface IDataContainer {
  data: any;
  loading: boolean;
  error?: string;
  title: string;
}

/**
 * Container component handling loading, error and empty data states. If one of those states
 * is valid then proper state component is displayed instead of the (children) component displaying
 * real data. See also {@link useServiceContainer}.
 *
 * @example
 * ```ts
 * // DataContainer component can be typically used together with useServiceContainer hook:
 * const serviceContainer = useServiceContainer(() => projectService.getProjects());
 * <DataContainer {...serviceContainer} title="Projects List">
 *   <ProjectsList projects={serviceContainer.data} />
 * </DataContainer>
 * ```
 *
 * @param data - Real data to be displayed when its fully loaded
 * @param loading - True if a request is pending, false when a request is successfully finished or when a request resulted in error
 * @param error - Error description when data loading was not successful
 * @param children - React children property
 */
export const DataContainer = ({ data, loading, error, title, children }: React.PropsWithChildren<IDataContainer>) => {
  // Initial loading: display Loading card when loading and no previous data is available (the component is rendered for the first time)
  if (loading && !data) return <LoadingStateCard title={title} />;

  // Refresh loading: keep previous real data with loading indicator when loading new data and previous real data is available
  // (the component was rendered at some point before)
  //  - for example: when page index is changed from page 1 to page 2
  //  - this will make UI more smooth and it prevents flickering user experience
  if (loading && data) return <RefreshStateCard>{children}</RefreshStateCard>;

  // Error state: display Error card when error
  if (error) return <ErrorStateCard title={title} error={error} />;

  // Invalid state, Error state should be triggered before this
  if (!data) throw new Error('DataContainer invalid state: when no data are available, error state should be returned');

  // Empty state: display Empty card when
  //  - request was successfully finished,
  //  - content property is available (= content property means table data with pagination are expected),
  //  - but no items are available
  if (data.content && !data.content.length) return <EmptyStateCard title={title} />;

  // Empty state: display Empty card when
  //  - request was successfully finished,
  //  - data is array
  //  - but no items are available
  //
  // Used for example for kafka service.
  if (Array.isArray(data) && !data.length) return <EmptyStateCard title={title} />;

  // Real data: display real data when it's loaded successfully and it's not empty
  return <>{children}</>;
};
