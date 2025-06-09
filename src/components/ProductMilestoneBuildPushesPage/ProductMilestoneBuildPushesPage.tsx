import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildPushesList } from 'components/BuildPushesList/BuildPushesList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneBuildPushesPageProps {
  componentId?: string;
}

export const ProductMilestoneBuildPushesPage = ({ componentId = 'bp1' }: IProductMilestoneBuildPushesPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: buildPushesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuildPushes = useServiceContainer(productMilestoneApi.getBuildPushes);
  const serviceContainerBuildPushesRunner = serviceContainerBuildPushes.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerBuildPushesRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
      [serviceContainerBuildPushesRunner, productMilestoneId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildPushFinished(wsData, { productMilestoneId })) {
          serviceContainerBuildPushesRunner({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: buildPushesQueryParamsObject },
          });
        }
      },
      [serviceContainerBuildPushesRunner, buildPushesQueryParamsObject, productMilestoneId]
    )
  );

  return <BuildPushesList {...{ serviceContainerBuildPushes, componentId }} />;
};
