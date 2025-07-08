import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback, useMemo } from 'react';

import { Build } from 'pnc-api-types-ts';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildStarted, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { refreshPage } from 'utils/refreshHelper';
import { debounce } from 'utils/utils';

interface IProductMilestoneBuildsPerformedPageProps {
  componentId?: string;
}

export const ProductMilestoneBuildsPerformedPage = ({ componentId = 'b1' }: IProductMilestoneBuildsPerformedPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: buildsPerformedQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuilds = useServiceContainer(productMilestoneApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;
  const serviceContainerBuildsSetter = serviceContainerBuilds.setData;

  const serviceContainerBuildsRunnerDebounced = useMemo(
    () => debounce(serviceContainerBuildsRunner),
    [serviceContainerBuildsRunner]
  );

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
      [serviceContainerBuildsRunner, productMilestoneId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData, { productMilestoneId })) {
          serviceContainerBuildsRunnerDebounced({
            serviceData: { id: productMilestoneId },
            requestConfig: { params: buildsPerformedQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData, { productMilestoneId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerBuildsRunnerDebounced, serviceContainerBuildsSetter, buildsPerformedQueryParamsObject, productMilestoneId]
    )
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <Content>
            <Content component={ContentVariants.h2}>Builds Performed</Content>
            <Content component={ContentVariants.p}>
              This list contains Builds in the Milestone. Builds produced from the Build Configuration are assigned to the current
              Milestone in the Product Version linked in the Build Configuration.
            </Content>
          </Content>
        </ToolbarItem>
      </Toolbar>
      <BuildsList {...{ serviceContainerBuilds, componentId }} />
    </>
  );
};
