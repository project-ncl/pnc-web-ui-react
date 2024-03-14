import { Build, GroupBuild } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as buildApi from 'services/buildApi';
import * as groupBuildApi from 'services/groupBuildApi';

import { isBuildCancelable } from 'utils/utils';

export interface ICancelBuildModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  build: Build | GroupBuild;
  variant: 'Build' | 'Group Build';
}

export const CancelBuildModal = ({ isModalOpen, toggleModal, build, variant }: ICancelBuildModalProps) => {
  const serviceContainerCloseBuild = useServiceContainer(
    variant === 'Build' ? buildApi.cancelBuild : groupBuildApi.cancelGroupBuild,
    0
  );

  const entityName = variant;

  const confirmModal = () => {
    serviceContainerCloseBuild
      .run({
        serviceData: { id: build.id },
      })
      .catch(() => {
        console.error(`Failed to cancel ${entityName}.`);
      });
  };

  return (
    <ActionModal
      modalTitle={`Abort ${entityName} #${build.id}?`}
      actionTitle={`Abort ${entityName}`}
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerCloseBuild}
      modalVariant="medium"
      refreshOnClose={false}
      isSubmitDisabled={build.status && !isBuildCancelable(build.status)}
      submitDisabledTooltip={`${entityName} is not in progress.`}
    >
      {entityName} in progress <b>#{build.id}</b> will be cancelled.
    </ActionModal>
  );
};
