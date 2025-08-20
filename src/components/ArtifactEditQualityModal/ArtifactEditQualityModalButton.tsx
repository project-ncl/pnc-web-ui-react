import { ButtonTitles } from 'common/constants';

import { ProtectedButton } from 'components/Button/Button';

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
    <ProtectedButton variant="secondary" onClick={toggleModal} size="sm" isDisabled={isDisabled} tooltip={disabledButtonReason}>
      {ButtonTitles.edit} quality
    </ProtectedButton>
  );
};
