import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BrewPushModal } from 'components/BrewPushModal/BrewPushModal';
import { BrewPushModalButton } from 'components/BrewPushModal/BrewPushModalButton';
import { calculateLongBuildName } from 'components/BuildName/BuildName';
import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';

import * as buildApi from 'services/buildApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerBuild: IServiceContainer };

export const BuildPages = () => {
  const { buildId } = useParams();

  const serviceContainerBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerBuildRunner = serviceContainerBuild.run;

  const [isBrewPushModalOpen, setIsBrewPushModalOpen] = useState<boolean>(false);

  const toggleBewPushModal = () => setIsBrewPushModalOpen((isBrewPushModalOpen) => !isBrewPushModalOpen);

  useEffect(() => {
    serviceContainerBuildRunner({ serviceData: { id: buildId } });
  }, [serviceContainerBuildRunner, buildId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerBuild,
      firstLevelEntity: 'Build',
      entityName: calculateLongBuildName(serviceContainerBuild.data),
    })
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="build-log">Build Log</TabsItem>
      <TabsItem url="alignment-log">Alignment Log</TabsItem>
      <TabsItem url="artifacts">Artifacts</TabsItem>
      <TabsItem url="dependencies">Dependencies</TabsItem>
      <TabsItem url="brew-push">Brew Push</TabsItem>
      <TabsItem url="build-metrics">Build Metrics</TabsItem>
      <TabsItem url="artifact-dependency-graph">Artifact Dependency Graph</TabsItem>
    </Tabs>
  );

  const actions = [<BrewPushModalButton toggleModal={toggleBewPushModal} build={serviceContainerBuild.data} />];

  return (
    <ServiceContainerLoading {...serviceContainerBuild} title="Build details">
      <PageLayout
        title={<BuildStatus build={serviceContainerBuild.data} long hideDatetime hideUsername />}
        tabs={pageTabs}
        actions={actions}
      >
        <Outlet context={{ serviceContainerBuild }} />
      </PageLayout>
      {isBrewPushModalOpen && (
        <BrewPushModal
          isModalOpen={isBrewPushModalOpen}
          toggleModal={toggleBewPushModal}
          build={serviceContainerBuild.data}
          variant="Build"
        />
      )}
    </ServiceContainerLoading>
  );
};

export function useServiceContainerBuild() {
  return useOutletContext<ContextType>();
}
