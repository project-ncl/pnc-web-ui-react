import { Link } from 'react-router';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { Build } from 'common/pnc-api-types-ts';

import { BuildName } from 'components/BuildName/BuildName';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IArtifactBuildProps {
  build: Build;
}

export const ArtifactBuild = ({ build }: IArtifactBuildProps) => (
  <>
    <span className="m-r-global">
      <TooltipWrapper tooltip={buildEntityAttributes.id.tooltip} /> <b>{buildEntityAttributes.id.title}:</b>{' '}
      <Link to={`/builds/${build.id}`}>#{build.id}</Link>
    </span>
    <span>
      <TooltipWrapper tooltip={buildEntityAttributes.name.tooltip} /> <b>{buildEntityAttributes.name.title}:</b>{' '}
      <BuildName build={build} long includeBuildLink includeConfigLink />
    </span>
  </>
);
