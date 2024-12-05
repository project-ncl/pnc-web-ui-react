import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IBuildConfigRestoreModalButtonProps {
  toggleModal: () => void;
  isDisabled?: boolean;
}

export const BuildConfigRestoreModalButton = ({ toggleModal, isDisabled = false }: IBuildConfigRestoreModalButtonProps) => (
  <ProtectedComponent>
    <Button variant="primary" onClick={toggleModal} size="sm" isDisabled={isDisabled}>
      Restore
    </Button>
  </ProtectedComponent>
);
