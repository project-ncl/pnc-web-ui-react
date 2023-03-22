import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { SCMRepository } from 'pnc-api-types-ts';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { EmptyStateSymbol } from 'components/EmptyStates/EmptyStateSymbol';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { parseExternalRepositoryUrl, parseInternalRepositoryUrl } from 'utils/utils';

interface IScmRepositoryUrlButtonProps {
  url: string;
  isInline?: boolean;
}

/**
 * The Internal Url button that redirect to specific Gerrit page.
 *
 * @param url - the external url for the SCM Repository
 * @param isInline - whether to use inline style with external link action
 */
const InternalUrlButton = ({ isInline, url }: IScmRepositoryUrlButtonProps) => (
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

/**
 * The external button that redirect to specific external page.
 *
 * @param url - the external url for the SCM Repository
 * @param isInline - whether to use inline style with external link action
 */
const ExternalUrlButton = ({ isInline, url }: IScmRepositoryUrlButtonProps) => {
  if (!url) {
    return <></>;
  }
  const urlResult = parseExternalRepositoryUrl({ externalUrl: url });
  if (!urlResult.url) {
    return <></>;
  }
  return (
    <TooltipWrapper tooltip={`View in ${urlResult.base}`}>
      <Button
        component="a"
        href={urlResult.url}
        target="_blank"
        rel="noopener noreferrer"
        variant={isInline ? 'plain' : 'tertiary'}
        icon={<ExternalLinkAltIcon />}
      >
        {isInline ? <ExternalLinkAltIcon /> : urlResult.base}
      </Button>
    </TooltipWrapper>
  );
};

interface IScmRepositoryUrlProps {
  scmRepository: SCMRepository;
  isInternal: boolean;
  isInline?: boolean;
}

/**
 * Represents the internal/external URL for the SCM Repository.
 *
 * @param scmRepository - the object the SCM Repository
 * @param isInternal - whether this is an internal or external SCM Repository URL
 * @param isInline - whether to use inline style with external link action
 */
export const ScmRepositoryUrl = ({ scmRepository, isInternal, isInline }: IScmRepositoryUrlProps) => {
  const url = isInternal ? scmRepository.internalUrl : scmRepository.externalUrl;
  if (!url) {
    return <EmptyStateSymbol />;
  }
  return (
    <CopyToClipboard
      isInline={isInline}
      suffixComponent={
        isInternal ? <InternalUrlButton isInline={isInline} url={url} /> : <ExternalUrlButton isInline={isInline} url={url} />
      }
    >
      {url ? url : <EmptyStateSymbol />}
    </CopyToClipboard>
  );
};
