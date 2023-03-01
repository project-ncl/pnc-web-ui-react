import { Flex, FlexItem, Label } from '@patternfly/react-core';

import { Artifact } from 'pnc-api-types-ts';

interface IArtifactIdentifierParserProps {
  artifact: Artifact;
}

export const ArtifactIdentifierParser = ({ artifact }: IArtifactIdentifierParserProps) => {
  const artifactNameSplitted = artifact.identifier.split(':');
  const repoType = artifact.targetRepository?.repositoryType;

  if (repoType === 'MAVEN') {
    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
        <FlexItem>
          <Label variant="outline" color="orange" isCompact>
            {artifactNameSplitted[0]}
          </Label>
        </FlexItem>
        <FlexItem>:</FlexItem>
        <FlexItem>
          <Label variant="outline" color="cyan" isCompact>
            {artifactNameSplitted[1]}
          </Label>
        </FlexItem>
        <FlexItem>:</FlexItem>
        <FlexItem>
          <Label variant="outline" color="purple" isCompact>
            {artifactNameSplitted[2]}
          </Label>
        </FlexItem>
        <FlexItem>:</FlexItem>
        <FlexItem>
          <Label variant="outline" color="green" isCompact>
            {artifactNameSplitted[3]}
          </Label>
        </FlexItem>
      </Flex>
    );
  }

  if (repoType === 'NPM') {
    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
        <FlexItem>
          <Label variant="outline" color="orange" isCompact>
            {artifactNameSplitted[0]}
          </Label>
        </FlexItem>
        <FlexItem>:</FlexItem>
        <FlexItem>
          <Label variant="outline" color="cyan" isCompact>
            {artifactNameSplitted[1]}
          </Label>
        </FlexItem>
      </Flex>
    );
  }

  return <>{artifact.identifier}</>;
};
