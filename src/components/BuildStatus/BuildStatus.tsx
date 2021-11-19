import { Build } from 'pnc-api-types-ts';

import './BuildStatus.css';

import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';

interface IBuildStatus {
  build: Build;
}

export const BuildStatus = ({ build }: IBuildStatus) => (
  <div className="build-status">
    <BuildStatusIcon build={build} />
    <BuildName build={build} />
    <span>
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
    <span>
      <b>{build.user}</b>
    </span>
  </div>
);
