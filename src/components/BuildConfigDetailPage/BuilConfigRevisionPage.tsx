import { useEffect } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetailPage/BuildConfigDetail';

import * as buildConfigApi from 'services/buildConfigApi';

export const BuildConfigRevisionPage = () => {
  const { buildConfigId, revisionId } = useParamsRequired();

  const serviceContainerBuildConfigRevision = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerBuildConfigRevisionRunner = serviceContainerBuildConfigRevision.run;
  const serviceContainerBuildConfig = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerBuildConfigRunner = serviceContainerBuildConfig.run;

  const isCurrentRevision = () => {
    if (!serviceContainerBuildConfig.data || !serviceContainerBuildConfigRevision.data) {
      return false;
    }
    return serviceContainerBuildConfig.data?.modificationTime === serviceContainerBuildConfigRevision.data?.modificationTime;
  };

  useEffect(() => {
    serviceContainerBuildConfigRevisionRunner({ serviceData: { buildConfigId, buildConfigRev: Number(revisionId) } });
    serviceContainerBuildConfigRunner({ serviceData: { id: buildConfigId } });
  }, [serviceContainerBuildConfigRevisionRunner, serviceContainerBuildConfigRunner, buildConfigId, revisionId]);

  return (
    <BuildConfigDetail
      {...{
        serviceContainerBuildConfig: serviceContainerBuildConfigRevision,
        isCurrentRevision: isCurrentRevision(),
      }}
      isRevisionVariant
    />
  );
};
