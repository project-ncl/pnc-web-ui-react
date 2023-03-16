import { Link } from 'react-router-dom';

import { SCMRepository } from 'pnc-api-types-ts';

interface IParseInternalRepositoryUrl {
  internalUrl: string;
}

/**
 * Parses internal repository url to SCM Repository name.
 *
 * @param object - object containing internalUrl field
 * @returns  SCM Repository name
 */
export const parseScmRepositoryTitle = ({ internalUrl }: IParseInternalRepositoryUrl) =>
  internalUrl ? internalUrl.split('/').splice(3).join('/') : '';

interface IScmRepositoryLinkProps {
  scmRepository: SCMRepository;
}

/**
 * The SCM Repository Link with the name that will be calculated from internalUrl.
 *
 * @param scmRepository - the SCM Repository object
 */
export const ScmRepositoryLink = ({ scmRepository }: IScmRepositoryLinkProps) => {
  const internalUrl = scmRepository.internalUrl;
  const scmRepositoryPath = `/scm-repositories/${scmRepository.id}`;
  const scmRepositoryTitle = parseScmRepositoryTitle({ internalUrl });
  return <Link to={scmRepositoryPath}>{scmRepositoryTitle}</Link>;
};
