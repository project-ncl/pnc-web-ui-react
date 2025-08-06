import { Button } from '@patternfly/react-core';

import { ButtonTitles } from 'common/constants';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

type IArtifactEditQualityModalButtonProps = {
  toggleModal: () => void;
} & ({ isBuildVariant?: false } | { isBuildVariant: true; buildArtifactsCount: number | undefined });

export const ArtifactEditQualityModalButton = ({
  toggleModal,
  isBuildVariant,
  ...props
}: IArtifactEditQualityModalButtonProps) => {
  const buildArtifactsCount = 'buildArtifactsCount' in props ? props.buildArtifactsCount : undefined;
  const disabledButtonReason = buildArtifactsCount === 0 ? 'Build contains no Artifacts.' : '';
  const isDisabled = !!disabledButtonReason || (isBuildVariant && !buildArtifactsCount);

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button variant="secondary" onClick={toggleModal} size="sm" isAriaDisabled={isDisabled}>
          {ButtonTitles.edit} quality
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
