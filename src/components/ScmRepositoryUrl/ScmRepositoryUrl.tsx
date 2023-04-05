import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { SCMRepository } from 'pnc-api-types-ts';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { IParsedUrl, parseExternalScmRepositoryUrl, parseInternalScmRepositoryUrl } from 'utils/utils';

interface IUrlButtonProps {
  parsedUrl: IParsedUrl;
  isInline?: boolean;
}

/**
 * The Url button that redirect to specific page.
 *
 * @param parsedUrl - the object contains url and displayName
 * @param isInline - whether to use inline style with external link action
 */
const UrlButton = ({ parsedUrl, isInline }: IUrlButtonProps) => (
  <TooltipWrapper tooltip={'View in ' + parsedUrl.displayName}>
    <Button
      component="a"
      href={parsedUrl.url}
      target="_blank"
      rel="noopener noreferrer"
      variant={isInline ? 'plain' : 'tertiary'}
      icon={<ExternalLinkAltIcon />}
    >
      {isInline ? <ExternalLinkAltIcon /> : parsedUrl.displayName}
    </Button>
  </TooltipWrapper>
);

interface IScmRepositoryUrlProps {
  internalScmRepository?: SCMRepository;
  externalScmRepository?: SCMRepository;
  isInline?: boolean;
}

/**
 * Represents the internal/external URL for the SCM Repository.
 *
 * @param internalScmRepository - the SCM Repository to parse its internal url
 * @param externalScmRepository - the SCM Repository to parse its external url
 * @param isInline - whether to use inline style with external link action
 */
export const ScmRepositoryUrl = ({ internalScmRepository, externalScmRepository, isInline }: IScmRepositoryUrlProps) => {
  const originalUrl = internalScmRepository ? internalScmRepository.internalUrl : externalScmRepository!.externalUrl;
  const parsedUrl = !originalUrl
    ? null
    : internalScmRepository
    ? parseInternalScmRepositoryUrl({ url: originalUrl })
    : parseExternalScmRepositoryUrl({ url: originalUrl });

  return parsedUrl ? (
    <CopyToClipboard isInline={isInline} suffixComponent={<UrlButton isInline={isInline} parsedUrl={parsedUrl} />}>
      {originalUrl}
    </CopyToClipboard>
  ) : null;
};
