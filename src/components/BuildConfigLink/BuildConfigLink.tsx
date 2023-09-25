import { Link } from 'react-router-dom';

interface IBuildConfigLinkProps {
  id: string;
  children?: React.ReactNode;
}

/**
 * Represents a link to a BuildConfigDetailPage of a specific BuildConfig.
 *
 * @param id - id of the BuildConfig to link to
 */
export const BuildConfigLink = ({ id, children }: IBuildConfigLinkProps) => <Link to={`/build-configs/${id}`}>{children}</Link>;
