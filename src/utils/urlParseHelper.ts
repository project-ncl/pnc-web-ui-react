interface IScmRepositoryUrl {
  url: string;
}

const preDefinedScmsPrefix: { [key: string]: string } = {
  gitlab: 'GitLab',
  github: 'GitHub',
  [process.env.REACT_APP_GERRIT_URL_BASE || 'code']: 'Gerrit',
};

// Regular expression to match 'git://','git+ssh://', 'http://', 'https://', 'git@', and 'ssh://git@'
const protocolRegex = /^(git:\/\/|git\+ssh:\/\/|http:\/\/|https:\/\/|git@|ssh:\/\/git@)/;

export interface IParsedUrl {
  webUrl: string;
  scmRepositoryUrl: string;
  name: string;
}

/**
 * Parses SCM Repository URL to gitweb link of the SCM Repository.
 *
 * @param url - The Url to be parsed
 * @returns Object containing scmRepository URL, parsed URL and display name representing URL
 *  */
export const parseScmRepositoryUrl = ({ url }: IScmRepositoryUrl): IParsedUrl => {
  const protocolMatch = url.match(protocolRegex) || [];
  const protocol = protocolMatch.at(1) || '';

  let webUrl = protocol === 'git@' ? url.replace(':', '/') : url;
  const base = webUrl.split(protocol).at(1)?.split('/').at(0) || '';

  // Find the first prefix in preDefinedScmsPrefix that matches the start of base
  const namePrefixKey = Object.keys(preDefinedScmsPrefix).find((key) => base.startsWith(key));
  const name = namePrefixKey ? preDefinedScmsPrefix[namePrefixKey] : base;

  // Special handling for URLs from Gerrit, will be removed after Gerrit support ends.
  const matchedGerritUrl = Object.keys(preDefinedScmsPrefix).find(
    (key) => key.includes(base) && preDefinedScmsPrefix[key] === 'Gerrit'
  );
  if (matchedGerritUrl) {
    const path = url.split(matchedGerritUrl).at(1) || '';
    const replaceRegex = path.startsWith('/gerrit/') ? /^\/gerrit\// : /^\//;
    webUrl = `https://${matchedGerritUrl}/gerrit/gitweb?p=${path.replace(replaceRegex, '')};a=summary`;
  } else {
    webUrl = webUrl.replace(protocol, 'https://');
  }

  return { scmRepositoryUrl: url, webUrl, name };
};
