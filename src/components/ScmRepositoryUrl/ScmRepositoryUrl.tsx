import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { parseInternalRepositoryUrl } from 'utils/utils';

interface IGerritButtonProps {
  url: string;
  isInline?: boolean;
}

/**
 * The Gerrit button that redirect to specific Gerrit page.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param isInline - whether to use inline style with external link action
 */
const GerritButton = ({ isInline, url }: IGerritButtonProps) => (
  <TooltipWrapper tooltip="View in Gerrit">
    <Button
      component="a"
      href={parseInternalRepositoryUrl({ internalUrl: url })}
      target="_blank"
      rel="noopener noreferrer"
      variant={isInline ? 'plain' : 'tertiary'}
      icon={<ExternalLinkAltIcon />}
    >
      {isInline ? <ExternalLinkAltIcon /> : 'Gerrit'}
    </Button>
  </TooltipWrapper>
);

interface IScmRepositoryUrlProps {
  url: string;
  showClipboardCopy?: boolean;
  showGerritButton?: boolean;
  isInline?: boolean;
}

/**
 * Represents a URL to a ProjectDetailPage of a specific project.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param showClipboardCopy - whether to display the url as clipboard copy
 * @param showGerritButton - whether to display the Gerrit button
 * @param isInline - whether to use inline style with external link action
 */
export const ScmRepositoryUrl = ({ url, showClipboardCopy = true, showGerritButton, isInline }: IScmRepositoryUrlProps) => {
  if (showClipboardCopy) {
    return (
      <CopyToClipboard isInline={isInline} suffixComponent={showGerritButton && <GerritButton isInline={isInline} url={url} />}>
        {url}
      </CopyToClipboard>
    );
  }
  return (
    <span>
      {url}
      {showGerritButton && <GerritButton isInline={isInline} url={url} />}
    </span>
  );
};
