import { Artifact } from 'pnc-api-types-ts';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

const ARTIFACT_QUALITIES: ILabelMapper<Artifact['artifactQuality']> = {
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

export const ArtifactQualityLabelMapper = ({ quality }: IArtifactQualityLabelProps) => (
  <LabelMapper mapper={ARTIFACT_QUALITIES[quality]} />
);
