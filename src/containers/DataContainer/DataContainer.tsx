import { EmptyStateCard } from '../../components/EmptyStates/EmptyStateCard';
import { ErrorStateCard } from '../../components/EmptyStates/ErrorStateCard';
import { LoadingStateCard } from '../../components/EmptyStates/LoadingStateCard';

interface IDataContainer {
  data: any;
  loading: boolean;
  error?: string;
  title: string;
}

/**
 * Container component handling loading, error and empty data states. If one of those states
 * is valid then proper state component is displayed instead of the (children) component displaying
 * real data. See also {@link useDataContainer}.
 *
 * @example
 * ```ts
 * // DataContainer component can be typically used together with useDataContainer hook:
 * const dataContainer = useDataContainer(() => projectService.getProjects());
 * <DataContainer {...dataContainer} title="Projects List">
 *   <ProjectsList projects={dataContainer.data} />
 * </DataContainer>
 * ```
 *
 * @param data - Real data to be displayed when its fully loaded
 * @param loading - True if a request is pending, false when a request is successfully finished or when a request resulted in error
 * @param error - Error description when data loading was not successful
 * @param children - React children property
 */
export const DataContainer = ({ data, loading, error, title, children }: React.PropsWithChildren<IDataContainer>) => {
  // display Loading card when loading
  if (loading) return <LoadingStateCard title={title} />;

  // display Error card when error
  if (error) return <ErrorStateCard title={title} error={error} />;

  // display Empty card when request was successfully finished, but no data is available
  if (!data.length) return <EmptyStateCard title={title} />;

  // display real data when it's loaded successfully and it's not empty
  return <>{children}</>;
};
