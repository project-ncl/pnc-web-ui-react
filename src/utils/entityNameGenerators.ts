interface IGenerateScmRepositoryName {
  internalUrl: string;
}

/**
 * Parses and generate SCM Repository name from internalUrl.
 *
 * @param object - object containing internalUrl field
 * @returns  SCM Repository name
 */
export const generateScmRepositoryName = ({ internalUrl }: IGenerateScmRepositoryName) =>
  internalUrl ? internalUrl.split('/').splice(3).join('/') : '';
