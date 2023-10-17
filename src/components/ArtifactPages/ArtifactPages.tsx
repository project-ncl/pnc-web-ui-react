import { useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { Artifact } from 'pnc-api-types-ts';

import { SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ArtifactEditQualityModal } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ArtifactEditQualityModalButton } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModalButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as artifactApi from 'services/artifactApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerArtifact: IServiceContainerState<Artifact> };

export const ArtifactPages = () => {
  const { artifactId } = useParamsRequired();

  const serviceContainerArtifact = useServiceContainer(artifactApi.getArtifact);
  const serviceContainerArtifactRunner = serviceContainerArtifact.run;

  const serviceContainerBuilds = useServiceContainer(artifactApi.getDependantBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  const [isEditQualityModalOpen, setIsEditQualityModalOpen] = useState<boolean>(false);

  const toggleEditQualityModal = () => setIsEditQualityModalOpen((isEditQualityModalOpen) => !isEditQualityModalOpen);

  useEffect(() => {
    serviceContainerArtifactRunner({ serviceData: { id: artifactId } });

    serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [serviceContainerArtifactRunner, serviceContainerBuildsRunner, artifactId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerArtifact,
      firstLevelEntity: 'Artifact',
      entityName: serviceContainerArtifact.data?.identifier,
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="usages">
        Usages{' '}
        <PageTabsLabel serviceContainer={serviceContainerBuilds} title="Usages Count">
          {serviceContainerBuilds.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="milestones">Milestones and Releases</PageTabsItem>
    </PageTabs>
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
          artifact={serviceContainerArtifact.data!}
          variant="detail"
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerArtifact() {
  return useOutletContext<ContextType>();
}
