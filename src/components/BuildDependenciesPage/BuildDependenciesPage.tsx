import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

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
          <PageSectionHeader
            title="Dependencies"
            description={
              <>This list contains Artifacts which are dependencies of this Build. Artifact is represented by PNC Identifier.</>
            }
          />
        </ToolbarItem>
      </Toolbar>
      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </>
  );
};
