import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetail/BuildConfigDetail';
import { useServiceContainerBuildConfig } from 'components/BuildConfigPages/BuildConfigPages';
import { BuildConfigRevisionsList } from 'components/BuildConfigRevisionsList/BuildConfigRevisionsList';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigRevisionsPageProps {
  componentId?: string;
}

export const BuildConfigRevisionsPage = ({ componentId = 'br1' }: IBuildConfigRevisionsPageProps) => {
  const { rev } = useParams();
  let revNumber: number | undefined = rev ? Number(rev) : undefined;
  if (revNumber) {
    if (isNaN(revNumber)) {
      throw new Error('Invalid Revision number param passed to BuildConfigRevisionsPage component');
    }
  }

  const { serviceContainerBuildConfig } = useServiceContainerBuildConfig();

  const serviceContainerBuildConfigRevisions = useServiceContainer(buildConfigApi.getRevisions);
  const serviceContainerRevisionsRunner = serviceContainerBuildConfigRevisions.run;

  const serviceContainerBuildConfigRevision = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerRevisionRunner = serviceContainerBuildConfigRevision.run;

  useEffect(() => {
    serviceContainerRevisionsRunner({ serviceData: { id: serviceContainerBuildConfig.data!.id } }).then((response) => {
      const buildConfigRevisionList = response.data.content;
      if (!buildConfigRevisionList?.[0]?.rev) {
        throw new Error(
          'Revision number of the latest BuildConfigRevision has to be defined in BuildConfigRevisionsPage component'
        );
      }
      buildConfigRevisionList &&
        buildConfigRevisionList.length > 0 &&
        serviceContainerRevisionRunner({
          serviceData: {
            buildConfigId: serviceContainerBuildConfig.data!.id,
            buildConfigRev: revNumber ?? buildConfigRevisionList[0].rev,
          },
        });
    });
  }, [serviceContainerRevisionsRunner, serviceContainerRevisionRunner, serviceContainerBuildConfig.data, revNumber]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerRevisionsRunner({ serviceData: { id: serviceContainerBuildConfig.data!.id }, requestConfig }),
    { componentId }
  );

  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <BuildConfigRevisionsList {...{ serviceContainerBuildConfigRevisions, selectedRevision: revNumber, componentId }} />
      </GridItem>
      <GridItem span={9}>
        <ServiceContainerLoading {...serviceContainerBuildConfigRevision} title={PageTitles.buildConfigRevision}>
          <BuildConfigDetail {...{ serviceContainerBuildConfigRevision }} />
        </ServiceContainerLoading>
      </GridItem>
    </Grid>
  );
};
