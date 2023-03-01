import { Flex, FlexItem, FlexProps, Label } from '@patternfly/react-core';

import { Artifact } from 'pnc-api-types-ts';

const generateLastLabel = (artifactNameSplitted: string[], lastIndex: number) => {
  return (
    artifactNameSplitted.length > lastIndex && (
      <>
        <FlexItem>:</FlexItem>
        <FlexItem>
          <Label variant="outline" color="grey" isCompact>
            {artifactNameSplitted.slice(lastIndex).join(':')}
          </Label>
        </FlexItem>
      </>
    )
  );
};

const spaceItemsXs: FlexProps['spaceItems'] = { default: 'spaceItemsXs' };

interface IArtifactIdentifierParserProps {
  artifact: Artifact;
}

export const ArtifactIdentifierParser = ({ artifact }: IArtifactIdentifierParserProps) => {
  const artifactNameSplitted = artifact.identifier.split(':');
  const repoType = artifact.targetRepository?.repositoryType;

  if (repoType === 'MAVEN') {
    return (
      <Flex spaceItems={spaceItemsXs}>
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
        {generateLastLabel(artifactNameSplitted, 4)}
      </Flex>
    );
  }

  if (repoType === 'NPM') {
    return (
      <Flex spaceItems={spaceItemsXs}>
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
        {generateLastLabel(artifactNameSplitted, 2)}
      </Flex>
    );
  }

  return <>{artifact.identifier}</>;
};
