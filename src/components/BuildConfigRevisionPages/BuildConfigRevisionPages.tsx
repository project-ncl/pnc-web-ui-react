import { Grid, GridItem } from '@patternfly/react-core';
import { useCallback } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigRevisionsList } from 'components/BuildConfigRevisionsList/BuildConfigRevisionsList';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigDetailPageProps {
  componentId?: string;
}

export const BuildConfigRevisionPages = ({ componentId = 'r1' }: IBuildConfigDetailPageProps) => {
  const { buildConfigId } = useParamsRequired();
  const { revisionId } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  const serviceContainerBuildConfigRevisions = useServiceContainer(buildConfigApi.getRevisions);
  const serviceContainerBuildConfigRevisionsRunner = serviceContainerBuildConfigRevisions.run;

  if (!revisionId && serviceContainerBuildConfigRevisions.data?.content?.length) {
    navigate(serviceContainerBuildConfigRevisions.data.content.at(0)?.rev + search, { replace: true });
  }

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerBuildConfigRevisionsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerBuildConfigRevisionsRunner, buildConfigId]
    ),
    { componentId, mandatoryQueryParams: { pagination: true, sorting: false } }
  );

  return (
    <Grid hasGutter>
      <GridItem sm={12} lg={3}>
        <BuildConfigRevisionsList {...{ serviceContainerBuildConfigRevisions, componentId, selectedRevision: revisionId }} />
      </GridItem>
      <GridItem sm={12} lg={9}>
        <Outlet />
      </GridItem>
    </Grid>
  );
};
