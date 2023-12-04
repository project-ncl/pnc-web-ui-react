import { Link } from 'react-router-dom';

interface IGroupConfigLinkProps {
  id: string;
  children?: React.ReactNode;
}

/**
 * Represents a link to a GroupConfigDetail of a specific GroupConfig
 *
 * @param id - id of the group config to link to
 * @param children - the children of the link
 */
export const GroupConfigLink = ({ id, children }: IGroupConfigLinkProps) => (
  <Link to={`/group-configs/${id}`} children={children} />
);
