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

interface IScmRepositoryNameProps {
  scmRepository: SCMRepository;
  isLink?: boolean;
}

/**
 * The SCM Repository name that will be calculated from internalUrl.
 *
 * @param scmRepository - the SCM Repository object
 * @param isLink - Whether the component will show as a link,
 */
export const ScmRepositoryName = ({ scmRepository, isLink }: IScmRepositoryNameProps) => {
  const internalUrl = scmRepository.internalUrl;
  const scmRepositoryPath = `/scm-repositories/${scmRepository.id}`;
  const scmRepositoryTitle = parseScmRepositoryTitle({ internalUrl });
  return isLink ? <Link to={scmRepositoryPath}>{scmRepositoryTitle}</Link> : <> {scmRepositoryTitle}</>;
};
