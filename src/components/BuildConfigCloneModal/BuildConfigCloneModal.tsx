import { Button } from '@patternfly/react-core';
import { Link } from 'react-router';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigCloneModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  buildConfig: BuildConfiguration;
}

export const BuildConfigCloneModal = ({ isModalOpen, toggleModal, buildConfig }: IBuildConfigCloneModalProps) => {
  const serviceContainerBuildConfigClone = useServiceContainer(buildConfigApi.cloneBuildConfig);

  const confirmModal = () => {
    return serviceContainerBuildConfigClone.run({
      serviceData: { id: buildConfig.id },
      onError: () => console.error('Failed to clone Build Config.'),
    });
  };

  return (
    <ActionModal
      modalTitle={`Clone ${buildConfig.name}?`}
      actionTitle="Clone Build Config"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerBuildConfigClone}
      modalVariant="medium"
      refreshOnClose={false}
      onSuccessActions={[
        <Button
          key="cloned-config-link"
          variant="secondary"
          onClick={() => toggleModal()}
          component={(props) => (
            <Link
              {...props}
              to={`/build-configs/${serviceContainerBuildConfigClone.data?.id}?bh1-force=${serviceContainerBuildConfigClone.data?.id}`}
            />
          )}
        >
          Go to the cloned Build Config
        </Button>,
      ]}
    >
      Build Config will be cloned including its parameters while the original Build Config will remain intact.
    </ActionModal>
  );
};
