import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { SCMRepository } from 'pnc-api-types-ts';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { uiLogger } from 'services/uiLogger';

import { IParsedUrl, parseScmRepositoryUrl } from 'utils/urlParseHelper';

interface IUrlButtonProps {
  parsedUrl: IParsedUrl;
  isInline?: boolean;
}

/**
 * The Url button that redirect to specific page.
 *
 * @param parsedUrl - the object contains url and name
 * @param isInline - whether to use inline style with external link action
 */
const UrlButton = ({ parsedUrl, isInline }: IUrlButtonProps) => (
  <TooltipWrapper tooltip={'View in ' + parsedUrl.name}>
    <Button
      component="a"
      href={parsedUrl.webUrl}
      target="_blank"
      rel="noopener noreferrer"
      variant={isInline ? 'plain' : 'tertiary'}
      icon={<ExternalLinkAltIcon />} //icon is ignored when variant plain is used
    >
      {isInline ? <ExternalLinkAltIcon /> : parsedUrl.name}
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
  let parsedUrl;
  if (internalScmRepository) {
    parsedUrl = parseScmRepositoryUrl({ url: internalScmRepository.internalUrl });
  } else if (externalScmRepository) {
    parsedUrl = externalScmRepository.externalUrl ? parseScmRepositoryUrl({ url: externalScmRepository.externalUrl }) : null;
  } else {
    uiLogger.error('internalScmRepository or externalScmRepository has to be defined');
  }

  return parsedUrl ? (
    <CopyToClipboard isInline={isInline} suffixComponent={<UrlButton isInline={isInline} parsedUrl={parsedUrl} />}>
      {parsedUrl.scmRepositoryUrl}
    </CopyToClipboard>
  ) : null;
};
