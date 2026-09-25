import { Build, GroupBuild } from 'common/pnc-api-types-ts';

import { ProtectedButton } from 'components/Button/Button';

import { BREW } from 'utils/features';

interface IBrewPushModalButtonProps {
  toggleModal: () => void;
  build: Build | GroupBuild;
}

export const BrewPushModalButton = ({ toggleModal, build }: IBrewPushModalButtonProps) => {
  const disabledButtonReason = !BREW.isEnabled
    ? BREW.disabledReason
    : build.status !== 'SUCCESS'
    ? 'Build was not successful.'
    : '';

  return (
    <ProtectedButton
      variant="primary"
      onClick={toggleModal}
      isDisabled={!!disabledButtonReason}
      size="sm"
      tooltip={disabledButtonReason}
    >
      Push to Brew
    </ProtectedButton>
  );
};
