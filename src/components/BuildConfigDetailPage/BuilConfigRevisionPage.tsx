import { useEffect } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetailPage/BuildConfigDetail';

import * as buildConfigApi from 'services/buildConfigApi';

export const BuildConfigRevisionPage = () => {
  const { buildConfigId, revisionId } = useParamsRequired();

  const serviceContainerBuildConfigRevision = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerBuildConfigRevisionRunner = serviceContainerBuildConfigRevision.run;

  useEffect(() => {
    serviceContainerBuildConfigRevisionRunner({ serviceData: { buildConfigId, buildConfigRev: Number(revisionId) } });
  }, [serviceContainerBuildConfigRevisionRunner, buildConfigId, revisionId]);

  return <BuildConfigDetail {...{ serviceContainerBuildConfig: serviceContainerBuildConfigRevision }} />;
};
