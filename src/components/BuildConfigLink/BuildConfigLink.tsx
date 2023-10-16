import { HistoryIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface IBuildConfigLinkProps {
  id: string;
  rev?: number;
  children?: React.ReactNode;
}

/**
 * Represents a link to a BuildConfigDetailPage of a specific BuildConfig.
 *
 * @param id - id of the BuildConfig to link to
 */
export const BuildConfigLink = ({ id, rev, children }: IBuildConfigLinkProps) => {
  return (
    <>
      <Link to={`/build-configs/${id}`}>{children}</Link>
      {rev && (
        <>
          <Link
            to={`/build-configs/${id}/revisions/${rev}`}
            title={`Go to specific Build Config revision (${rev}) that was used for this Build`}
            className="p-l-5"
          >
            <HistoryIcon />
          </Link>
        </>
      )}
    </>
  );
};
