import { ProtectedButton } from 'components/Button/Button';

interface IBuildConfigCloneModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const BuildConfigCloneModalButton = ({ toggleModal, variant }: IBuildConfigCloneModalButtonProps) => (
  <ProtectedButton variant={variant === 'list' ? 'plain' : 'secondary'} onClick={toggleModal} size="sm">
    Clone
  </ProtectedButton>
);
