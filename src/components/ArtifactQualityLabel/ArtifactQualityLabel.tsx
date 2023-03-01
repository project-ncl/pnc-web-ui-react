import { Label, LabelProps } from '@patternfly/react-core';

import { Artifact } from 'pnc-api-types-ts';

interface QualityMapper {
  [key: string]: {
    text: string;
    color: LabelProps['color'];
  };
}

const ARTIFACT_QUALITIES: QualityMapper = {
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
  const artifactQuality = ARTIFACT_QUALITIES[quality];

  return artifactQuality ? <Label color={artifactQuality.color}>{artifactQuality.text}</Label> : <>&mdash;</>;
};
