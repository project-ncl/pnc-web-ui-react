import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';

import { parseInternalRepositoryUrl, parseScmRepositoryTitle } from 'utils/utils';

interface IScmRepositoryLinkProps {
  url: string;
  repositoryId?: string;
  showClipboardCopy?: boolean;
  showGerritButton?: boolean;
}

/**
 * Represents a link to a ProjectDetailPage of a specific project.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param repositoryId - id of the SCM Repository to link to,
 * @param showClipboardCopy - whether to display the url as clipboard copy
 * @param showGerritButton - whether to display the Gerrit button
 */
export const ScmRepositoryLink = ({ url, repositoryId, showClipboardCopy = true, showGerritButton }: IScmRepositoryLinkProps) => {
  const gerritButton = showGerritButton && (
    <Button
      component="a"
      href={parseInternalRepositoryUrl({ internalUrl: url })}
      target="_blank"
      rel="noopener noreferrer"
      variant="tertiary"
      icon={<ExternalLinkAltIcon />}
    >
      Gerrit
    </Button>
  );
  if (repositoryId) {
    return <Link to={repositoryId} children={parseScmRepositoryTitle({ internalUrl: url })} />;
  }
  if (showClipboardCopy) {
    return <CopyToClipboard suffixComponent={gerritButton}>{url}</CopyToClipboard>;
  }
  return (
    <span>
      {url}
      {gerritButton}
    </span>
  );
};
