import { ArrowRightIcon } from '@patternfly/react-icons';
import { Link } from 'react-router';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IPageIconLinkProps {
  to: string;
  text?: string;
  tooltip?: string;
}

/**
 * Icon with link to internal page.
 *
 * @param to - link to redirect to
 * @param text - text to display next to icon
 * @param tooltip - tooltip text
 */
export const PageIconLink = ({ to, text, tooltip }: IPageIconLinkProps) => (
  <TooltipWrapper tooltip={tooltip as string}>
    <Link to={to}>
      {text} <ArrowRightIcon />
    </Link>
  </TooltipWrapper>
);
