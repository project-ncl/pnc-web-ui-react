import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { ProductVersion } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { TOTAL_COUNT_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerProductVersion: IServiceContainerState<ProductVersion> };

export const ProductVersionPages = () => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerProductMilestones = useServiceContainer(productVersionApi.getProductMilestones);
  const serviceContainerProductMilestonesRunner = serviceContainerProductMilestones.run;

  const serviceContainerProductReleases = useServiceContainer(productVersionApi.getProductReleases);
  const serviceContainerProductReleasesRunner = serviceContainerProductReleases.run;

  const serviceContainerBuildConfigs = useServiceContainer(productVersionApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  const serviceContainerGroupConfigs = useServiceContainer(productVersionApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  useEffect(() => {
    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });

    serviceContainerProductMilestonesRunner({ serviceData: { id: productVersionId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerProductReleasesRunner({ serviceData: { id: productVersionId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
    serviceContainerGroupConfigsRunner({ serviceData: { id: productVersionId }, requestConfig: TOTAL_COUNT_REQUEST_CONFIG });
  }, [
    serviceContainerProductVersionRunner,
    serviceContainerProductMilestonesRunner,
    serviceContainerProductReleasesRunner,
    serviceContainerBuildConfigsRunner,
    serviceContainerGroupConfigsRunner,
    productVersionId,
  ]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductVersion,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: [serviceContainerProductVersion.data?.version, serviceContainerProductVersion.data?.product?.name],
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="milestones">
        Milestones{' '}
        <PageTabsLabel serviceContainer={serviceContainerProductMilestones} title="Milestones Count">
          {serviceContainerProductMilestones.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="releases">
        Releases{' '}
        <PageTabsLabel serviceContainer={serviceContainerProductReleases} title="Releases Count">
          {serviceContainerProductReleases.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="build-configs">
        Build Configs{' '}
        <PageTabsLabel serviceContainer={serviceContainerBuildConfigs} title="Build Configs Count">
          {serviceContainerBuildConfigs.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="group-configs">
        Group Configs{' '}
        <PageTabsLabel serviceContainer={serviceContainerGroupConfigs} title="Group Configs Count">
          {serviceContainerGroupConfigs.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title="Product Version details">
      <PageLayout
        title={`${serviceContainerProductVersion.data?.product?.name} ${serviceContainerProductVersion.data?.version}`}
        tabs={pageTabs}
        breadcrumbs={[
          { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
          { entity: breadcrumbData.productVersion.id, title: serviceContainerProductVersion.data?.version },
        ]}
        actions={
          <ProtectedComponent>
            <ActionButton link="edit">Edit Product Version</ActionButton>
          </ProtectedComponent>
        }
      >
        <Outlet context={{ serviceContainerProductVersion }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerProductVersion() {
  return useOutletContext<ContextType>();
}
