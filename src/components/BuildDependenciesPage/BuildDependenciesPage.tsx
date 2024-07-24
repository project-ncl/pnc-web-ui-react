import { Text, TextContent, ToolbarItem } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as buildApi from 'services/buildApi';

interface IBuildDependenciesPageProps {
  componentId?: string;
}

export const BuildDependenciesPage = ({ componentId = 'd1' }: IBuildDependenciesPageProps) => {
  const { buildId } = useParamsRequired();

  const serviceContainerArtifacts = useServiceContainer(buildApi.getDependencies);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig }),
      [serviceContainerArtifactsRunner, buildId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text>
              This list contains Artifacts which are dependencies of this Build. Artifact is represented by PNC Identifier.
            </Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>
      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </>
  );
};
