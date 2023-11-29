import { Grid } from '@patternfly/react-core';
import { useEffect } from 'react';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetail/BuildConfigDetail';
import { useServiceContainerBuildConfig } from 'components/BuildConfigPages/BuildConfigPages';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productVersionApi from 'services/productVersionApi';

export const BuildConfigDetailPage = () => {
  const { serviceContainerBuildConfig } = useServiceContainerBuildConfig();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  useEffect(() => {
    if (serviceContainerBuildConfig.data?.productVersion) {
      serviceContainerProductVersionRunner({ serviceData: { id: serviceContainerBuildConfig.data.productVersion.id } });
    }
  }, [serviceContainerProductVersionRunner, serviceContainerBuildConfig.data?.productVersion]);

  return (
    <ServiceContainerLoading {...serviceContainerBuildConfig} title={PageTitles.buildConfigDetail}>
      <Grid hasGutter>
        <BuildConfigDetail {...{ serviceContainerBuildConfig, serviceContainerProductVersion }} />
      </Grid>
    </ServiceContainerLoading>
  );
};
