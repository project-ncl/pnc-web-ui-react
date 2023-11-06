import { useEffect } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productVersionApi from 'services/productVersionApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerProductVersion: IServiceContainer };

export const ProductVersionPages = () => {
  const { productVersionId } = useParams();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  useEffect(() => {
    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [serviceContainerProductVersionRunner, productVersionId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProductVersion,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: `${serviceContainerProductVersion.data?.version} ${PageTitles.delimiterSymbol} ${serviceContainerProductVersion.data?.product.name}`,
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="milestones">Milestones</PageTabsItem>
      <PageTabsItem url="releases">Releases</PageTabsItem>
      <PageTabsItem url="build-configs">Build Configs</PageTabsItem>
      <PageTabsItem url="group-configs">Group Configs</PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title="Product Version details">
      <PageLayout
        title={`${serviceContainerProductVersion.data?.product.name} ${serviceContainerProductVersion.data?.version}`}
        tabs={pageTabs}
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
