import { Button } from '@patternfly/react-core';

import { IArtifactEditQualityModalProps } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IArtifactEditQualityModalButtonProps {
  toggleModal: () => void;
  variant: IArtifactEditQualityModalProps['variant'];
}

export const ArtifactEditQualityModalButton = ({ toggleModal, variant }: IArtifactEditQualityModalButtonProps) => (
  <ProtectedComponent>
    <Button variant={variant === 'list' ? 'secondary' : 'tertiary'} onClick={toggleModal} isSmall>
      Edit Quality
    </Button>
  </ProtectedComponent>
);
