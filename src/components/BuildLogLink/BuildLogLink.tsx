import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as webConfigService from 'services/webConfigService';

interface IBuildLogLinkProps {
  buildId: string;
  isIconVariant?: boolean;
  title?: string;
}

export const BuildLogLink = ({ buildId, isIconVariant = false, title = 'View raw' }: IBuildLogLinkProps) => {
  const buildLogUrl = `${webConfigService.getPncUrl()}/builds/${buildId}/logs/build`;

  return isIconVariant ? (
    <TooltipWrapper tooltip={title}>
      <Button variant="plain" target="_blank" rel="noopener noreferrer" component="a" href={buildLogUrl} style={{ padding: 0 }}>
        <ExternalLinkAltIcon /> {title}
      </Button>
    </TooltipWrapper>
  ) : (
    <a target="_blank" rel="noopener noreferrer" href={buildLogUrl}>
      {title}
    </a>
  );
};
