import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ArtifactEditQualityModal } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ArtifactEditQualityModalButton } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModalButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';

import * as artifactApi from 'services/artifactApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerArtifact: IServiceContainer };

export const ArtifactPages = () => {
  const { artifactId } = useParams();

  const serviceContainerArtifact = useServiceContainer(artifactApi.getArtifact);
  const serviceContainerArtifactRunner = serviceContainerArtifact.run;

  const [isEditQualityModalOpen, setIsEditQualityModalOpen] = useState<boolean>(false);

  const toggleEditQualityModal = () => setIsEditQualityModalOpen((isEditQualityModalOpen) => !isEditQualityModalOpen);

  useEffect(() => {
    serviceContainerArtifactRunner({ serviceData: { id: artifactId } });
  }, [serviceContainerArtifactRunner, artifactId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerArtifact,
      firstLevelEntity: 'Artifact',
      entityName: serviceContainerArtifact.data?.identifier,
    })
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="usages">Usages</TabsItem>
      <TabsItem url="milestones">Milestones and Releases</TabsItem>
    </Tabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerArtifact} title="Artifact details">
      <PageLayout
        title={serviceContainerArtifact.data?.identifier}
        actions={<ArtifactEditQualityModalButton toggleModal={toggleEditQualityModal} variant="detail" />}
        tabs={pageTabs}
      >
        <Outlet context={{ serviceContainerArtifact }} />
      </PageLayout>
      {isEditQualityModalOpen && (
        <ArtifactEditQualityModal
          isModalOpen={isEditQualityModalOpen}
          toggleModal={toggleEditQualityModal}
          artifact={serviceContainerArtifact.data}
          variant="detail"
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerArtifact() {
  return useOutletContext<ContextType>();
}
