import { Link } from 'react-router-dom';

interface IProjectLinkProps {
  id: string;
  children?: React.ReactNode;
}

/**
 * Represents a link to a ProjectDetailPage of a specific project
 *
 * @param id - id of the project to link to
 * @param children - the children of the link
 */
export const ProjectLink = ({ id, children }: IProjectLinkProps) => <Link to={id} children={children} />;
