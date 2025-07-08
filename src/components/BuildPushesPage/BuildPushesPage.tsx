import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildPushesList } from 'components/BuildPushesList/BuildPushesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildApi from 'services/buildApi';

interface IBuildPushesPageProps {
  componentId?: string;
}

export const BuildPushesPage = ({ componentId = 'bp1' }: IBuildPushesPageProps) => {
  const { buildId } = useParamsRequired();

  const { componentQueryParamsObject: buildPushesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuildPushes = useServiceContainer(buildApi.getBuildPushes);
  const serviceContainerBuildPushesRunner = serviceContainerBuildPushes.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerBuildPushesRunner({ serviceData: { id: buildId }, requestConfig }),
      [serviceContainerBuildPushesRunner, buildId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildPushFinished(wsData, { buildId })) {
          serviceContainerBuildPushesRunner({
            serviceData: { id: buildId },
            requestConfig: { params: buildPushesQueryParamsObject },
          });
        }
      },
      [serviceContainerBuildPushesRunner, buildPushesQueryParamsObject, buildId]
    )
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <Content>
            <Content component={ContentVariants.h2}>Build Pushes</Content>
            <Content component={ContentVariants.p}>This list contains Pushes of the Build.</Content>
          </Content>
        </ToolbarItem>
      </Toolbar>
      <BuildPushesList {...{ serviceContainerBuildPushes, componentId }} />
    </>
  );
};
