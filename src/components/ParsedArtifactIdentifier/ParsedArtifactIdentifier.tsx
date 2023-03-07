import { Flex, FlexItem, FlexProps, Label, LabelProps } from '@patternfly/react-core';

import { Artifact } from 'pnc-api-types-ts';

const LABEL_COLORS: LabelProps['color'][] = ['orange', 'cyan', 'purple', 'green', 'grey'];

interface IGeneratedLabelProps {
  artifactLabel: string;
  index: number;
}

const GeneratedLabel = ({ artifactLabel, index }: IGeneratedLabelProps) => (
  <>
    {index !== 0 && <FlexItem>:</FlexItem>}
    <FlexItem>
      <Label variant="outline" color={LABEL_COLORS[index]} isCompact>
        {artifactLabel}
      </Label>
    </FlexItem>
  </>
);

const spaceItemsXs: FlexProps['spaceItems'] = { default: 'spaceItemsXs' };

interface IParsedArtifactIdentifierProps {
  artifact: Artifact;
}

/**
 * Component to highlight labels of Artifact identifier.
 * Identifier is PNC specific identifier only derived from the GAV, etc.
 *
 * @param artifact - Artifact (containing identifier)
 */
export const ParsedArtifactIdentifier = ({ artifact }: IParsedArtifactIdentifierProps) => {
  const artifactNameSplitted = artifact.identifier.split(':');
  const repoType = artifact.targetRepository?.repositoryType;

  if (repoType === 'MAVEN' || repoType === 'NPM') {
    const labelCount = repoType === 'MAVEN' ? 4 : 2;
    const artifactLabels = [
      ...artifactNameSplitted.slice(0, labelCount),
      ...(artifactNameSplitted.length > labelCount ? [artifactNameSplitted.slice(labelCount).join(':')] : []),
    ];

    return (
      <Flex spaceItems={spaceItemsXs}>
        {artifactLabels.map((artifactLabel: string, index: number) => (
          <GeneratedLabel artifactLabel={artifactLabel} index={index} />
        ))}
      </Flex>
    );
  }

  return <>{artifact.identifier}</>;
};
