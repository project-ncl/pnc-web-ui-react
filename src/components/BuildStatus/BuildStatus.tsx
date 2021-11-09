import { FC } from 'react';

import './BuildStatus.css';

import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';

import { Build } from '../../scripts/Build';

export const BuildStatus: FC<Build> = ({ identifier, status, user, date }) => (
  <div className="build-status">
    <BuildStatusIcon buildStatus={status} />
    <BuildName identifier={identifier} link="to_be_added" />
    <span>
      {date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </span>
    <span>
      <b>{user}</b>
    </span>
  </div>
);
