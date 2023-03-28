import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useEffect } from 'react';
import { Link, Outlet, useOutletContext, useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { IServiceContainer, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Tabs } from 'components/Tabs/Tabs';
import { TabsItem } from 'components/Tabs/TabsItem';

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

  const pageBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to="/products">Products</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Link to="..">{serviceContainerProductVersion.data?.product.name}</Link>
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{serviceContainerProductVersion.data?.version}</BreadcrumbItem>
    </Breadcrumb>
  );

  const pageTabs = (
    <Tabs>
      <TabsItem url="details">Details</TabsItem>
      <TabsItem url="milestones">Milestones</TabsItem>
      <TabsItem url="releases">Releases</TabsItem>
      <TabsItem url="build-configs">Build Configs</TabsItem>
      <TabsItem url="group-configs">Group Configs</TabsItem>
    </Tabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title="Product Version details">
      <PageLayout
        title={`${serviceContainerProductVersion.data?.product.name} ${serviceContainerProductVersion.data?.version}`}
        breadcrumb={pageBreadcrumb}
        tabs={pageTabs}
      >
        <Outlet context={{ serviceContainerProductVersion }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerProductVersion() {
  return useOutletContext<ContextType>();
}
