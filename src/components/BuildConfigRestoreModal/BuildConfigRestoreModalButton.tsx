import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IBuildConfigRestoreModalButtonProps {
  toggleModal: () => void;
  disabledButtonReason?: string;
}

export const BuildConfigRestoreModalButton = ({ toggleModal, disabledButtonReason }: IBuildConfigRestoreModalButtonProps) => (
  <ProtectedComponent>
    <TooltipWrapper tooltip={disabledButtonReason}>
      <Button variant="primary" onClick={toggleModal} size="sm" isAriaDisabled={!!disabledButtonReason}>
        Restore
      </Button>
    </TooltipWrapper>
  </ProtectedComponent>
);
