import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as artifactApi from 'services/artifactApi';

interface IArtifactUsagesPageProps {
  componentId?: string;
}

export const ArtifactUsagesPage = ({ componentId = 'b1' }: IArtifactUsagesPageProps) => {
  const { artifactId } = useParamsRequired();

  const { componentQueryParamsObject: artifactUsagesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuilds = useServiceContainer(artifactApi.getDependantBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: artifactId }, requestConfig }),
      [serviceContainerBuildsRunner, artifactId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildFinished(wsData)) {
          serviceContainerBuildsRunner({
            serviceData: { id: artifactId },
            requestConfig: { params: artifactUsagesQueryParamsObject },
          });
        }
      },
      [serviceContainerBuildsRunner, artifactUsagesQueryParamsObject, artifactId]
    )
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Content>
            <Content component={ContentVariants.h2}>Usages</Content>
            <Content component={ContentVariants.p}>This list shows in which Builds this Artifact was used as dependency.</Content>
          </Content>
        </ToolbarItem>
      </Toolbar>
      <BuildsList {...{ serviceContainerBuilds, componentId }} />{' '}
    </>
  );
};
