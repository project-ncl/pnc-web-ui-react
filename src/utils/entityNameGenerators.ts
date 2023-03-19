import { SCMRepository } from 'pnc-api-types-ts';

interface IGenerateScmRepositoryName {
  scmRepository: SCMRepository;
}

/**
 * Parses and generate SCM Repository name from SCMRepository object.
 *
 * @param {object} scmRepository contains internalUrl field
 * @returns {string} SCM Repository name
 */
export const generateScmRepositoryName = ({ scmRepository }: IGenerateScmRepositoryName): string =>
  scmRepository!.internalUrl ? scmRepository.internalUrl.split('/').splice(3).join('/') : '';
