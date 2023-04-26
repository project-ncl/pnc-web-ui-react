import { Artifact } from 'pnc-api-types-ts';

import { Label } from 'components/Label/Label';
import { ILabelMapper } from 'components/Label/Label';

const ARTIFACT_QUALITIES: ILabelMapper = {
  NEW: {
    text: 'NEW',
    color: 'grey',
  },
  VERIFIED: {
    text: 'VERIFIED',
    color: 'blue',
  },
  TESTED: {
    text: 'TESTED',
    color: 'green',
  },
  DEPRECATED: {
    text: 'DEPRECATED',
    color: 'orange',
  },
  BLACKLISTED: {
    text: 'BLACKLISTED',
    color: 'red',
  },
  DELETED: {
    text: 'DELETED',
    color: 'red',
  },
  TEMPORARY: {
    text: 'TEMPORARY',
    color: 'cyan',
  },
  IMPORTED: {
    text: 'IMPORTED',
    color: 'grey',
  },
};

interface IArtifactQualityLabelProps {
  quality: Artifact['artifactQuality'];
}

export const ArtifactQualityLabel = ({ quality }: IArtifactQualityLabelProps) => {
  return <Label labelObject={ARTIFACT_QUALITIES[quality]}></Label>;
};
