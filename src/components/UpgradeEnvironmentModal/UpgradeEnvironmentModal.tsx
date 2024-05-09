import { List, ListItem } from '@patternfly/react-core';
import { useEffect, useMemo } from 'react';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';
import * as environmentApi from 'services/environmentApi';

interface IUpgradeEnvironmentModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  buildConfig: BuildConfiguration;
}

export const UpgradeEnvironmentModal = ({ isModalOpen, toggleModal, buildConfig }: IUpgradeEnvironmentModalProps) => {
  const serviceContainerNewEnvironment = useServiceContainer(environmentApi.getEnvironment, 0);
  const serviceContainerNewEnvironmentRunner = serviceContainerNewEnvironment.run;

  const serviceContainerUpgradeEnvironment = useServiceContainer(buildConfigApi.upgradeEnvironment, 0);

  const replacementEnvironmentId = useMemo(
    () => buildConfig.environment!.attributes!.DEPRECATION_REPLACEMENT,
    [buildConfig.environment]
  );

  useEffect(() => {
    serviceContainerNewEnvironmentRunner({ serviceData: { id: replacementEnvironmentId } });
  }, [serviceContainerNewEnvironmentRunner, replacementEnvironmentId]);

  const confirmModal = () => {
    serviceContainerUpgradeEnvironment
      .run({
        serviceData: {
          buildConfigId: buildConfig.id,
          replacementEnvironmentId,
        },
      })
      .catch(() => {
        console.error('Failed to upgrade the Environment.');
      });
  };

  return (
    <ActionModal
      modalTitle={`Upgrade environment ${buildConfig.environment?.name}?`}
      actionTitle="Upgrade"
      isOpen={isModalOpen}
      onToggle={toggleModal}
      onSubmit={confirmModal}
      serviceContainer={serviceContainerUpgradeEnvironment}
      modalVariant="medium"
      isSubmitDisabled={!serviceContainerNewEnvironment.data}
    >
      Environment will be upgraded
      <List className="m-t-5">
        <ListItem>
          from: <b>{buildConfig.environment?.description}</b>
        </ListItem>
        <ListItem>
          to:{' '}
          <ServiceContainerLoading {...serviceContainerNewEnvironment} title="Environment" variant="icon">
            <b>{serviceContainerNewEnvironment.data?.description}</b>
          </ServiceContainerLoading>
        </ListItem>
      </List>
    </ActionModal>
  );
};
