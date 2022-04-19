import { Link } from 'react-router-dom';

interface IProjectLinkProps {
  id: string;
  children?: React.ReactNode;
}

export const ProjectLink = ({ id, children }: IProjectLinkProps) => <Link to={id} children={children} />;
