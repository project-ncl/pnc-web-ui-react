import { Flex, FlexItem, FlexProps, Label, LabelProps } from '@patternfly/react-core';
import { Link } from 'react-router';

import { Artifact } from 'pnc-api-types-ts';

import { PageIconLink } from 'components/PageIconLink/PageIconLink';

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
  const artifactIdentifierSplitted = artifact.identifier.split(':');
  const repositoryType = artifact.targetRepository?.repositoryType;

  if (repositoryType === 'MAVEN' || repositoryType === 'NPM') {
    const labelCount = repositoryType === 'MAVEN' ? 4 : 2;
    const artifactLabels = [
      ...artifactIdentifierSplitted.slice(0, labelCount),
      ...(artifactIdentifierSplitted.length > labelCount ? [artifactIdentifierSplitted.slice(labelCount).join(':')] : []),
    ];

    return (
      <Flex spaceItems={spaceItemsXs}>
        {artifactLabels.map((artifactLabel: string, index: number) => (
          <GeneratedLabel key={index} artifactLabel={artifactLabel} index={index} />
        ))}
        <FlexItem>
          <PageIconLink tooltip="Go to Artifact detail page." to={`/artifacts/${artifact.id}`} />
        </FlexItem>
      </Flex>
    );
  }

  return <Link to={`/artifacts/${artifact.id}`}>{artifact.identifier}</Link>;
};
