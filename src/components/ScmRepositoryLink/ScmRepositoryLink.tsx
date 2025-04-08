import { Link } from 'react-router';

import { SCMRepository } from 'pnc-api-types-ts';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';

interface IScmRepositoryLinkProps {
  scmRepository: SCMRepository;
}

/**
 * The SCM Repository Link with the name that will be calculated from internalUrl.
 *
 * @param scmRepository - the SCM Repository object
 */
export const ScmRepositoryLink = ({ scmRepository }: IScmRepositoryLinkProps) => {
  const scmRepositoryPath = `/scm-repositories/${scmRepository.id}`;
  return <Link to={scmRepositoryPath}>{generateScmRepositoryName({ scmRepository })}</Link>;
};
