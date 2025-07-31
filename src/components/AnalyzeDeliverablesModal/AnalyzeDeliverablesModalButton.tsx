import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IAnalyzeDeliverablesModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const AnalyzeDeliverablesModalButton = ({ toggleModal, variant }: IAnalyzeDeliverablesModalButtonProps) => {
  const isListVariant = variant === 'list';

  return (
    <ProtectedComponent>
      <Button
        variant={isListVariant ? 'plain' : 'tertiary'}
        onClick={toggleModal}
        className={css(isListVariant && 'full-width b-radius-0')}
        size={!isListVariant ? 'sm' : 'default'}
      >
        Analyze Deliverables
      </Button>
    </ProtectedComponent>
  );
};
