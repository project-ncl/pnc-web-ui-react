import { ProtectedButton } from 'components/Button/Button';

interface IBuildConfigRestoreModalButtonProps {
  toggleModal: () => void;
  disabledButtonReason?: string;
}

export const BuildConfigRestoreModalButton = ({ toggleModal, disabledButtonReason }: IBuildConfigRestoreModalButtonProps) => (
  <ProtectedButton
    variant="tertiary"
    onClick={toggleModal}
    size="sm"
    tooltip={disabledButtonReason}
    isDisabled={!!disabledButtonReason}
  >
    Restore
  </ProtectedButton>
);
