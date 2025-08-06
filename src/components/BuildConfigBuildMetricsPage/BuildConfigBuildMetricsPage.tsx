import { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';

import { PageTitles } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildMetrics } from 'components/BuildMetrics/BuildMetrics';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';

const BUILD_METRICS_PAGE_REQUEST_CONFIG: AxiosRequestConfig = { params: { pageSize: 200, sort: '=desc=submitTime' } };

export const BuildConfigBuildMetricsPage = () => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerBuilds = useServiceContainer(buildConfigApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  useEffect(() => {
    serviceContainerBuildsRunner({ serviceData: { id: buildConfigId }, requestConfig: BUILD_METRICS_PAGE_REQUEST_CONFIG });
  }, [serviceContainerBuildsRunner, buildConfigId]);

  return (
    <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.buildMetrics}>
      <ContentBox marginBottom>
        {serviceContainerBuilds.data?.content && (
          <BuildMetrics builds={serviceContainerBuilds.data.content} chartType="line" componentId="bm-l" />
        )}
      </ContentBox>

      <ContentBox>
        {serviceContainerBuilds.data?.content && (
          <BuildMetrics builds={serviceContainerBuilds.data.content} chartType="horizontalBar" componentId="bm-b" />
        )}
      </ContentBox>
    </ServiceContainerLoading>
  );
};
