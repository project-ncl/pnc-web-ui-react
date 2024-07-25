import { BuildConfigurationRevision } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigRestoreModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  buildConfigRevision: BuildConfigurationRevision;
}

export const BuildConfigRestoreModal = ({ isModalOpen, toggleModal, buildConfigRevision }: IBuildConfigRestoreModalProps) => {
  const serviceContainerBuildConfigRestore = useServiceContainer(buildConfigApi.restoreBuildConfig);

  const confirmModal = () => {
    return serviceContainerBuildConfigRestore.run({
      serviceData: { buildConfigId: buildConfigRevision.id, buildConfigRev: buildConfigRevision.rev! },
      onError: () => console.error('Failed to restore Build Config Revision.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`Restore ${buildConfigRevision.name}?`}
      actionTitle="Restore Build Config Revision"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerBuildConfigRestore}
      modalVariant="medium"
    >
      Build Config will be restored to this Revision.
    </ActionModal>
  );
};
