import { Grid, GridItem } from '@patternfly/react-core';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigRevisionsList } from 'components/BuildConfigRevisionsList/BuildConfigRevisionsList';

import * as buildConfigApi from 'services/buildConfigApi';

import { getComponentQueryParamValue } from 'utils/queryParamsHelper';

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

  const [isCurrentRevision, setIsCurrentRevision] = useState<boolean>(false);

  if (!revisionId && serviceContainerBuildConfigRevisions.data?.content?.length) {
    navigate(serviceContainerBuildConfigRevisions.data.content.at(0)?.rev + search, { replace: true });
  }

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerBuildConfigRevisionsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerBuildConfigRevisionsRunner, buildConfigId]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.pagination }
  );

  useEffect(() => {
    const pageIndex = getComponentQueryParamValue(search, 'pageIndex', componentId);
    if (serviceContainerBuildConfigRevisions.data?.content?.length && pageIndex === '1') {
      const latestRev = serviceContainerBuildConfigRevisions.data.content[0]?.rev;
      setIsCurrentRevision(String(latestRev) === revisionId);
    } else {
      setIsCurrentRevision(false);
    }
  }, [serviceContainerBuildConfigRevisions.data, revisionId, search, componentId]);

  return (
    <Grid hasGutter>
      <GridItem sm={12} lg={3}>
        <BuildConfigRevisionsList {...{ serviceContainerBuildConfigRevisions, componentId, selectedRevision: revisionId }} />
      </GridItem>
      <GridItem sm={12} lg={9}>
        <Outlet context={{ isCurrentRevision }} />
      </GridItem>
    </Grid>
  );
};
