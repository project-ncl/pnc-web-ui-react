interface IScmRepositoryUrl {
  url: string;
}

export interface IParsedUrl {
  webUrl: string;
  scmRepositoryUrl: string;
  name: string;
}

/**
 * Parses internal SCM Repository URL to Gerrit gitweb link of the SCM Repository.
 *
 * @param url - The internalUrl to be parsed
 * @returns Object containing scmRepository URL, parsed URL and display name representing URL
 *  */
export const parseInternalScmRepositoryUrl = ({ url }: IScmRepositoryUrl): IParsedUrl => {
  const protocol = url.split('://')[0];
  const base = url.split('://')[1].split('/')[0];
  const project = url.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
  return { scmRepositoryUrl: url, webUrl: 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary', name: 'Gerrit' };
};

/**
 * ParsesSCM Repository URL to gitweb link of the SCM Repository.
 *
 * @param url - The externalUrl to be parsed
 * @returns  Object containing scmRepository URL, parsed URL and display name representing URL
 */
export const parseExternalScmRepositoryUrl = ({ url }: IScmRepositoryUrl): IParsedUrl | null => {
  if (!url) {
    return null;
  }
  if (url.includes('/gerrit/')) {
    return parseInternalScmRepositoryUrl({ url });
  }
  if (['http', 'https', '@'].some((element) => url.includes(element))) {
    const urlRes = url.includes('@') ? 'https://' + url.split('@')[1].replace(':', '/') : url;
    const base = urlRes.split('://')[1].split('/')[0];
    return { scmRepositoryUrl: url, webUrl: urlRes, name: base };
  }
  if (url.includes('.git')) {
    const urlRes = url;
    const base = urlRes.split('/')[0];
    return { scmRepositoryUrl: url, webUrl: urlRes, name: base };
  }
  return null;
};
