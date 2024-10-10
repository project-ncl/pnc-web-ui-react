import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as webConfigService from 'services/webConfigService';

interface IAlignmentLogLinkProps {
  buildId: string;
  isIconVariant?: boolean;
  title?: string;
}

/**
 * Link to the full raw alignment log. Opens in the new tab.
 *
 * @param buildId - ID of alignment log Build
 * @param isIconVariant - if true, displays button with a icon, otherwise, plain anchor link
 * @param title - displayed text on the button/link
 */
export const AlignmentLogLink = ({ buildId, isIconVariant, title = 'View raw' }: IAlignmentLogLinkProps) => {
  const alignmentLogUrl = `${webConfigService.getPncUrl()}/builds/${buildId}/logs/align`;

  return isIconVariant ? (
    <TooltipWrapper tooltip={title}>
      <Button
        variant="plain"
        target="_blank"
        rel="noopener noreferrer"
        component="a"
        href={alignmentLogUrl}
        style={{ padding: 0 }}
      >
        <ExternalLinkAltIcon /> {title}
      </Button>
    </TooltipWrapper>
  ) : (
    <a target="_blank" rel="noopener noreferrer" href={alignmentLogUrl}>
      {title}
    </a>
  );
};
