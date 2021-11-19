import './BuildStatus.css';

import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';

import { BuildStatusType } from '../../scripts/Build';

interface IBuildStatus {
  name: string;
  status: BuildStatusType;
  user: string;
  date: Date;
}

export const BuildStatus = ({ name, status, user, date }: IBuildStatus) => (
  <div className="build-status">
    <BuildStatusIcon buildStatus={status} />
    <BuildName name={name} link="to_be_added" />
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
