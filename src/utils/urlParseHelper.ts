interface IScmRepositoryUrl {
  url: string;
}

const preDefinedScmsPrefix: { [key: string]: string } = {
  [process.env.REACT_APP_GERRIT_URL_BASE || 'code']: 'Gerrit',
  [process.env.REACT_APP_GERRIT_STAGE_URL_BASE || 'code']: 'Gerrit',
  gitlab: 'GitLab',
  github: 'GitHub',
};

/* 
 Regular expression to match:
  - 'git://',
  - 'git+ssh://[username]@',
  - 'git+ssh://', 
  - 'http://', 
  - 'https://', 
  - 'git@', 
  - 'ssh://[username]@',
  - 'ssh://'
*/
const protocolRegex =
  /^(git:\/\/|git\+ssh:\/\/[a-zA-Z0-9.\-_]+@|git\+ssh:\/\/|http:\/\/|https:\/\/|git@|ssh:\/\/[a-zA-Z0-9.\-_]+@)|ssh:\/\//;

// Regular expression to identify SCP-like URI, e.g., 'git@github.com:example-user/project-name.git'
const scpRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+):(.+)$/;

const portNumberRegex = /:\d+\//;

export interface IParsedUrl {
  webUrl: string;
  scmRepositoryUrl: string;
  name: string;
}

/**
 * Parses SCM Repository URI or SCP-like URI to webview link of the SCM Repository.
 *
 * In SCP-like URIs, the text after ':' is never regarded as the port but as part of the path,
 * which is the username or organization of the SCM; for other URIs, it will be considered as
 * the port and be removed when parsing it to web-view links.
 *
 * @param url - The Url to be parsed
 * @returns Object containing scmRepository URL, parsed URL and display name representing URL
 *  */
export const parseScmRepositoryUrl = ({ url }: IScmRepositoryUrl): IParsedUrl => {
  const protocolMatch = url.match(protocolRegex) || [];
  const protocol = protocolMatch.at(0) || '';

  let webUrl = url.match(scpRegex) ? url.replace(':', '/') : url.replace(portNumberRegex, '/');
  const base = webUrl.split(protocol).at(1)?.split('/').at(0) || '';

  // Find the first prefix in preDefinedScmsPrefix that matches the start of base
  const namePrefixKey = Object.keys(preDefinedScmsPrefix).find((key) => base.startsWith(key));
  const name = namePrefixKey ? preDefinedScmsPrefix[namePrefixKey] : base;

  // Special handling for URLs from Gerrit, will be removed after Gerrit support ends.
  const matchedGerritUrl = Object.keys(preDefinedScmsPrefix).find(
    (key) => base.includes(key) && preDefinedScmsPrefix[key] === 'Gerrit'
  );
  if (matchedGerritUrl) {
    const path = webUrl.split(base).at(1) || '';
    const replaceRegex = path.startsWith('/gerrit/') ? /^\/gerrit\// : /^\//;
    webUrl = `https://${base}/gerrit/gitweb?p=${path.replace(replaceRegex, '')};a=summary`;
  } else {
    webUrl = webUrl.replace(protocol, 'https://');
  }

  return { scmRepositoryUrl: url, webUrl, name };
};
