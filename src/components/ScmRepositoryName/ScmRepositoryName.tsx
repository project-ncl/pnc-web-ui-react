import { Link } from 'react-router-dom';

import { parseScmRepositoryTitle } from 'utils/utils';

interface IScmRepositoryNameProps {
  url: string;
  scmRepositoryId: string;
}

/**
 * The SCM Repository name that lead to SCM Repository detail page.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param scmRepositoryId - id of the SCM Repository,
 */
export const ScmRepositoryName = ({ url, scmRepositoryId }: IScmRepositoryNameProps) => {
  return <Link to={scmRepositoryId}>{parseScmRepositoryTitle({ internalUrl: url })}</Link>;
};
