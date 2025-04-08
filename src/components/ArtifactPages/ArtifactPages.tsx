import { useCallback, useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router';

import { Artifact } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
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

  const serviceContainerProductMilestonesReleases = useServiceContainer(artifactApi.getProductMilestonesReleases);
  const serviceContainerProductMilestonesReleasesRunner = serviceContainerProductMilestonesReleases.run;

  const [isEditQualityModalOpen, setIsEditQualityModalOpen] = useState<boolean>(false);

  const toggleEditQualityModal = () => setIsEditQualityModalOpen((isEditQualityModalOpen) => !isEditQualityModalOpen);

  useEffect(() => {
    serviceContainerArtifactRunner({ serviceData: { id: artifactId } });

    serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerProductMilestonesReleasesRunner({
      serviceData: { id: artifactId },
      requestConfig: TOTAL_COUNT_REQUEST_CONFIG,
    });
  }, [serviceContainerArtifactRunner, serviceContainerBuildsRunner, serviceContainerProductMilestonesReleasesRunner, artifactId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildFinished(wsData)) {
          serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
        }
      },
      [serviceContainerBuildsRunner, artifactId]
    )
  );

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
      <PageTabsItem url="milestones">
        Milestones and Releases{' '}
        <PageTabsLabel serviceContainer={serviceContainerProductMilestonesReleases} title="Milestones and Releases Count">
          {serviceContainerProductMilestonesReleases.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerArtifact} title="Artifact details">
      <PageLayout
        title={serviceContainerArtifact.data?.identifier}
        breadcrumbs={[{ entity: breadcrumbData.artifact.id, title: serviceContainerArtifact.data?.id }]}
        actions={<ArtifactEditQualityModalButton toggleModal={toggleEditQualityModal} />}
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
