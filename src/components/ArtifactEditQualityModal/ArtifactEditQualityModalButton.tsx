import { Button, ButtonProps } from '@patternfly/react-core';

import { ButtonTitles } from 'common/constants';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

type IArtifactEditQualityModalButtonProps = {
  toggleModal: () => void;
  variant?: ButtonProps['variant'];
} & ({ isBuildVariant?: false } | { isBuildVariant: true; buildArtifactsCount: number | undefined });

export const ArtifactEditQualityModalButton = ({
  toggleModal,
  variant = 'secondary',
  isBuildVariant,
  ...props
}: IArtifactEditQualityModalButtonProps) => {
  const buildArtifactsCount = 'buildArtifactsCount' in props ? props.buildArtifactsCount : undefined;
  const disabledButtonReason = buildArtifactsCount === 0 ? 'Build contains no Artifacts.' : '';
  const isDisabled = !!disabledButtonReason || (isBuildVariant && !buildArtifactsCount);

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button variant={variant} onClick={toggleModal} isSmall isAriaDisabled={isDisabled}>
          {ButtonTitles.update} quality
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
