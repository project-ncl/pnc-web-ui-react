import { Link } from 'react-router-dom';

import { parseScmRepositoryTitle } from 'utils/utils';

interface IScmRepositoryNameProps {
  url: string;
  repositoryId: string;
}

/**
 * The repository name that lead to repository detail page.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param repositoryId - id of the SCM Repository,
 */
export const ScmRepositoryName = ({ url, repositoryId }: IScmRepositoryNameProps) => {
  return <Link to={repositoryId}>{parseScmRepositoryTitle({ internalUrl: url })}</Link>;
};
