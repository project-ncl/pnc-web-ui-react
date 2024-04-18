import { Button } from '@patternfly/react-core';

import { ButtonTitles } from 'common/constants';

import { IArtifactEditQualityModalProps } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

type IArtifactEditQualityModalButtonProps = {
  toggleModal: () => void;
  variant: IArtifactEditQualityModalProps['variant'];
} & ({ isBuildVariant?: false } | { isBuildVariant: true; buildArtifactsCount: number | undefined });

export const ArtifactEditQualityModalButton = ({
  toggleModal,
  variant,
  isBuildVariant,
  ...props
}: IArtifactEditQualityModalButtonProps) => {
  const buildArtifactsCount = 'buildArtifactsCount' in props ? props.buildArtifactsCount : undefined;
  const disabledButtonReason = buildArtifactsCount === 0 ? 'Build contains no Artifacts.' : '';
  const isDisabled = !!disabledButtonReason || (isBuildVariant && !buildArtifactsCount);

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button variant={variant === 'list' ? 'secondary' : 'tertiary'} onClick={toggleModal} isSmall isAriaDisabled={isDisabled}>
          {ButtonTitles.edit} Quality
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
