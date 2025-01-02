import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigDetail } from 'components/BuildConfigDetailPage/BuildConfigDetail';

import * as buildConfigApi from 'services/buildConfigApi';

interface IOutletContext {
  isCurrentRevision: boolean;
}

export const BuildConfigRevisionPage = () => {
  const { buildConfigId, revisionId } = useParamsRequired();
  const { isCurrentRevision } = useOutletContext<IOutletContext>();

  const serviceContainerBuildConfigRevision = useServiceContainer(buildConfigApi.getRevision);
  const serviceContainerBuildConfigRevisionRunner = serviceContainerBuildConfigRevision.run;

  useEffect(() => {
    serviceContainerBuildConfigRevisionRunner({ serviceData: { buildConfigId, buildConfigRev: Number(revisionId) } });
  }, [serviceContainerBuildConfigRevisionRunner, buildConfigId, revisionId]);

  return (
    <BuildConfigDetail
      {...{
        serviceContainerBuildConfig: serviceContainerBuildConfigRevision,
        isRevisionVariant: true,
        isCurrentRevision,
      }}
    />
  );
};
