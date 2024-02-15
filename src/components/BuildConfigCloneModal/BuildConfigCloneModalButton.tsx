import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IBuildConfigCloneModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const BuildConfigCloneModalButton = ({ toggleModal, variant }: IBuildConfigCloneModalButtonProps) => (
  <ProtectedComponent>
    <Button variant={variant === 'list' ? 'secondary' : 'tertiary'} onClick={toggleModal} isSmall>
      Clone
    </Button>
  </ProtectedComponent>
);
