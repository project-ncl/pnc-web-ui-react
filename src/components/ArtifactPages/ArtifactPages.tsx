import { useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
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
        actions={<ActionButton action={() => console.log('TODO')}>Edit Quality</ActionButton>}
        tabs={pageTabs}
      >
        <Outlet context={{ serviceContainerArtifact }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerArtifact() {
  return useOutletContext<ContextType>();
}
