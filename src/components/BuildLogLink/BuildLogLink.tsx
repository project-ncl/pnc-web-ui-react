import * as webConfigService from 'services/webConfigService';

interface IBuildLogLinkProps {
  buildId: string;
  title?: string;
}

export const BuildLogLink = ({ buildId, title = 'view' }: IBuildLogLinkProps) => (
  <a target="_blank" rel="noopener noreferrer" href={`${webConfigService.getPncUrl()}/builds/${buildId}/logs/build`}>
    {title}
  </a>
);
