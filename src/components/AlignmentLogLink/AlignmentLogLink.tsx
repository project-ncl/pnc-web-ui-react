import * as webConfigService from 'services/webConfigService';

interface IAlignmentLogLinkProps {
  buildId: string;
  title?: string;
}

export const AlignmentLogLink = ({ buildId, title = 'view' }: IAlignmentLogLinkProps) => (
  <a target="_blank" rel="noopener noreferrer" href={`${webConfigService.getPncUrl()}/builds/${buildId}/logs/align`}>
    {title}
  </a>
);
