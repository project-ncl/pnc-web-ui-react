import axios, { AxiosRequestConfig } from 'axios';

import { RepositoryUrls } from 'common/constants';

type TGithubCommit = { sha: string; commit: { message: string } };

export const getCurrentPncWebUiCommit = (requestConfig: AxiosRequestConfig = {}) => {
  return axios.get<TGithubCommit>(getGithubRepoApiUrl(RepositoryUrls.pncWebUiRepository), requestConfig);
};

const getGithubRepoApiUrl = (githubRepoUrl: string) => {
  const repoName = githubRepoUrl.split('github.com/').at(1) ?? '';

  return `https://api.github.com/repos/${repoName}/commits/main`;
};
