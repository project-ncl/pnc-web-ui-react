import { Link } from 'react-router-dom';

import { Build } from 'pnc-api-types-ts';

import { buildEntityAttributes } from 'common/buildEntityAttributes';

import { BuildName } from 'components/BuildName/BuildName';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IArtifactBuildProps {
  build: Build;
}

export const ArtifactBuild = ({ build }: IArtifactBuildProps) => (
  <>
    <span className="p-r-20">
      <TooltipWrapper tooltip={buildEntityAttributes.id.tooltip} /> <b>{buildEntityAttributes.id.title}:</b>{' '}
      <Link to={`/builds/${build.id}`}>#{build.id}</Link>
    </span>
    <span>
      <TooltipWrapper tooltip={buildEntityAttributes.name.tooltip} /> <b>{buildEntityAttributes.name.title}:</b>{' '}
      <BuildName build={build} long includeBuildLink includeConfigLink />
    </span>
  </>
);
