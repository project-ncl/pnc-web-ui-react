import { useEffect } from 'react';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetailPage/BuildConfigDetail';
import { useServiceContainerBuildConfig } from 'components/BuildConfigPages/BuildConfigPages';

import * as productVersionApi from 'services/productVersionApi';

export const BuildConfigDetailPage = () => {
  const { serviceContainerBuildConfig } = useServiceContainerBuildConfig();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion, 0);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  useEffect(() => {
    if (serviceContainerBuildConfig.data?.productVersion) {
      serviceContainerProductVersionRunner({ serviceData: { id: serviceContainerBuildConfig.data.productVersion.id } });
    }
  }, [serviceContainerProductVersionRunner, serviceContainerBuildConfig.data?.productVersion]);

  return <BuildConfigDetail {...{ serviceContainerBuildConfig, serviceContainerProductVersion }} />;
};
