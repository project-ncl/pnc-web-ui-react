import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IBuildConfigCloneModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const BuildConfigCloneModalButton = ({ toggleModal, variant }: IBuildConfigCloneModalButtonProps) => (
  <ProtectedComponent>
    <Button variant={variant === 'list' ? 'plain' : 'secondary'} onClick={toggleModal} size="sm">
      Clone
    </Button>
  </ProtectedComponent>
);
