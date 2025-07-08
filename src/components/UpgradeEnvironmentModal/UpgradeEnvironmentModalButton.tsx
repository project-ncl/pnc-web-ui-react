import { Button } from '@patternfly/react-core';
import { LevelUpAltIcon } from '@patternfly/react-icons';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IUpgradeEnvironmentModalButtonButtonProps {
  toggleModal: () => void;
  buildConfig: BuildConfiguration;
}

export const UpgradeEnvironmentModalButton = ({ toggleModal, buildConfig }: IUpgradeEnvironmentModalButtonButtonProps) => {
  const disabledButtonReason = !buildConfig.environment?.attributes?.DEPRECATION_REPLACEMENT
    ? 'No replacement to update the environment with is available.'
    : '';

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button
          variant="tertiary"
          onClick={toggleModal}
          isAriaDisabled={!!disabledButtonReason}
          size="sm"
          icon={<LevelUpAltIcon />}
        >
          Upgrade
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
