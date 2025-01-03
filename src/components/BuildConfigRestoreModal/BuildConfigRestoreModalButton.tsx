import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IBuildConfigRestoreModalButtonProps {
  toggleModal: () => void;
  isDisabled?: boolean;
}

export const BuildConfigRestoreModalButton = ({ toggleModal, isDisabled = false }: IBuildConfigRestoreModalButtonProps) => (
  <ProtectedComponent>
    <div title={isDisabled ? 'Restore button is disabled for the current revision' : undefined}>
      <Button variant="primary" onClick={toggleModal} size="sm" isDisabled={isDisabled}>
        Restore
      </Button>
    </div>
  </ProtectedComponent>
);
