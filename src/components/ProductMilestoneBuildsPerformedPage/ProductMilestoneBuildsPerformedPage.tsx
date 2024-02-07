import { useCallback } from 'react';

import { Build } from 'pnc-api-types-ts';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildStarted, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { refreshPage } from 'utils/refreshHelper';

interface IProductMilestoneBuildsPerformedPageProps {
  componentId?: string;
}

export const ProductMilestoneBuildsPerformedPage = ({ componentId = 'b1' }: IProductMilestoneBuildsPerformedPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: buildsPerformedQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuilds = useServiceContainer(productMilestoneApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;
  const serviceContainerBuildsSetter = serviceContainerBuilds.setData;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData, { productMilestoneId })) {
          serviceContainerBuildsRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: buildsPerformedQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData, { productMilestoneId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerBuildsRunner, serviceContainerBuildsSetter, buildsPerformedQueryParamsObject, productMilestoneId]
    )
  );

  return <BuildsList {...{ serviceContainerBuilds, componentId }} />;
};
