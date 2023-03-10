import { Button, ClipboardCopyAction } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { parseInternalRepositoryUrl } from 'utils/utils';

interface IScmRepositoryLinkProps {
  url: string;
  showClipboardCopy?: boolean;
  showGerritButton?: boolean;
  isInline?: boolean;
}

/**
 * Represents a link to a ProjectDetailPage of a specific project.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param showClipboardCopy - whether to display the url as clipboard copy
 * @param showGerritButton - whether to display the Gerrit button
 * @param isInline - whether to use inline style with external link action
 */
export const ScmRepositoryLink = ({ url, showClipboardCopy = true, showGerritButton, isInline }: IScmRepositoryLinkProps) => {
  const GerritButton = () => (
    <TooltipWrapper tooltip="View in Gerrit">
      <Button
        component="a"
        href={parseInternalRepositoryUrl({ internalUrl: url })}
        target="_blank"
        rel="noopener noreferrer"
        variant={isInline ? 'plain' : 'tertiary'}
        icon={<ExternalLinkAltIcon />}
      >
        {isInline && <ExternalLinkAltIcon />}
        {!isInline && 'Gerrit'}
      </Button>
    </TooltipWrapper>
  );

  if (showClipboardCopy) {
    return (
      <CopyToClipboard
        isInline={isInline}
        additionalActions={
          isInline &&
          showGerritButton && (
            <ClipboardCopyAction>
              <GerritButton />
            </ClipboardCopyAction>
          )
        }
        suffixComponent={!isInline && showGerritButton && <GerritButton />}
      >
        {url}
      </CopyToClipboard>
    );
  }
  return (
    <span>
      {url}
      {showGerritButton && GerritButton}
    </span>
  );
};
