import { Button } from '@patternfly/react-core';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IBrewPushModalButtonProps {
  toggleModal: () => void;
  build: Build | GroupBuild;
}

export const BrewPushModalButton = ({ toggleModal, build }: IBrewPushModalButtonProps) => {
  const disabledButtonReason = build.status !== 'SUCCESS' ? 'Build was not successful.' : '';

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button variant="primary" onClick={toggleModal} isAriaDisabled={!!disabledButtonReason} isBlock isSmall>
          Push to Brew
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
