import { SCMRepository } from 'pnc-api-types-ts';

interface IGenerateScmRepositoryName {
  scmRepository: SCMRepository;
}

/**
 * Parses and generate SCM Repository name from SCMRepository object.
 *
 * @param scmRepository - SCM Repository containing internalUrl field
 * @returns SCM Repository name
 */
export const generateScmRepositoryName = ({ scmRepository }: IGenerateScmRepositoryName): string =>
  scmRepository && scmRepository.internalUrl ? scmRepository.internalUrl.split('/').splice(3).join('/') : '';
