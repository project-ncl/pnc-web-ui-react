import { css } from '@patternfly/react-styles';

import { ProtectedButton } from 'components/Button/Button';

interface IAnalyzeDeliverablesModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const AnalyzeDeliverablesModalButton = ({ toggleModal, variant }: IAnalyzeDeliverablesModalButtonProps) => {
  const isListVariant = variant === 'list';

  return (
    <ProtectedButton
      variant={isListVariant ? 'plain' : 'secondary'}
      onClick={toggleModal}
      className={css(isListVariant && 'full-width b-radius-0')}
      size={isListVariant ? 'default' : 'sm'}
    >
      Analyze Deliverables
    </ProtectedButton>
  );
};
