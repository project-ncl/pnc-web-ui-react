import { Link } from 'react-router';

interface IGroupBuildLinkProps {
  id: string;
  children?: React.ReactNode;
}

/**
 * Represents a link to a GroupBuildDetailPage of a specific Group Build
 *
 * @param id - id of the Group Build to link to
 */
export const GroupBuildLink = ({ id, children }: IGroupBuildLinkProps) => <Link to={`/group-builds/${id}`}>{children}</Link>;
