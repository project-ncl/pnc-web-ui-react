import { Link } from 'react-router-dom';

import { parseScmRepositoryTitle } from 'utils/utils';

interface IScmRepositoryNameProps {
  internalUrl: string;
  scmRepositoryId: string;
}

/**
 * The SCM Repository name that lead to SCM Repository detail page.
 *
 * @param internalUrl - the internal url for the SCM Repository
 * @param scmRepositoryId - id of the SCM Repository,
 */
export const ScmRepositoryName = ({ internalUrl, scmRepositoryId }: IScmRepositoryNameProps) => {
  return <Link to={scmRepositoryId}>{parseScmRepositoryTitle({ internalUrl })}</Link>;
};
