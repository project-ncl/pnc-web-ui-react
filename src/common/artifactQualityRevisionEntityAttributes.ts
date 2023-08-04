import { ArtifactRevision } from 'pnc-api-types-ts';

import { artifactEntityAttributes } from 'common/artifactEntityAttributes';
import { TEntityAttributes } from 'common/entityAttributes';

interface IExtendedArtifactRevision extends ArtifactRevision {
  'modificationUser.username': any;
}

export const artifactQualityRevisionEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  artifactQuality: artifactEntityAttributes.artifactQuality,
  modificationTime: {
    id: 'modificationTime',
    title: 'Modification Date',
    sort: {},
  },
  'modificationUser.username': {
    id: 'modificationUser.username',
    title: 'Modification User',
  },
  qualityLevelReason: {
    id: 'qualityLevelReason',
    title: 'Reason',
  },
} as const satisfies TEntityAttributes<IExtendedArtifactRevision>;
