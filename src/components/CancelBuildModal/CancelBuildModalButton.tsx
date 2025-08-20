import { Build, GroupBuild } from 'pnc-api-types-ts';

import { ProtectedButton } from 'components/Button/Button';

import { isBuildCancelable } from 'utils/utils';

interface ICancelBuildModalButtonProps {
  toggleModal: () => void;
  build: Build | GroupBuild;
  variant: 'Build' | 'Group Build';
}

export const CancelBuildModalButton = ({ toggleModal, build, variant }: ICancelBuildModalButtonProps) => {
  const entityName = variant;
  const disabledButtonReason = build.status && !isBuildCancelable(build.status) ? `${entityName} is not in progress.` : '';

  return (
    <ProtectedButton
      variant="primary"
      onClick={toggleModal}
      size="sm"
      tooltip={disabledButtonReason}
      isDisabled={!!disabledButtonReason}
    >
      Abort
    </ProtectedButton>
  );
};
