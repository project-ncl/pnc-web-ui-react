import { LevelUpAltIcon } from '@patternfly/react-icons';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { ProtectedButton } from 'components/Button/Button';

interface IUpgradeEnvironmentModalButtonButtonProps {
  toggleModal: () => void;
  buildConfig: BuildConfiguration;
}

export const UpgradeEnvironmentModalButton = ({ toggleModal, buildConfig }: IUpgradeEnvironmentModalButtonButtonProps) => {
  const disabledButtonReason = !buildConfig.environment?.attributes?.DEPRECATION_REPLACEMENT
    ? 'No replacement to update the environment with is available.'
    : '';

  return (
    <ProtectedButton
      variant="tertiary"
      onClick={toggleModal}
      isDisabled={!!disabledButtonReason}
      size="sm"
      icon={<LevelUpAltIcon />}
      tooltip={disabledButtonReason}
    >
      Upgrade
    </ProtectedButton>
  );
};
