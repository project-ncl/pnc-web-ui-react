import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { AlignmentLogLink } from 'components/AlignmentLogLink/AlignmentLogLink';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

import * as buildApi from 'services/buildApi';

export const BuildAlignmentLogPage = () => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();
  const isBuilding = useMemo(() => serviceContainerBuild.data?.status === 'BUILDING', [serviceContainerBuild.data?.status]);

  const serviceContainerAlignmentLog = useServiceContainer(buildApi.getAlignmentLog);
  const serviceContainerAlignmentLogRunner = serviceContainerAlignmentLog.run;

  const logData = useMemo(() => serviceContainerAlignmentLog.data?.split(/[\r\n]/) || [], [serviceContainerAlignmentLog.data]);

  useEffect(() => {
    if (!isBuilding) {
      serviceContainerAlignmentLogRunner({ serviceData: { id: buildId } });
    }
  }, [serviceContainerAlignmentLogRunner, buildId, isBuilding]);

  return (
    <>
      {!isBuilding && (
        <ContentBox>
          <ServiceContainerLoading {...serviceContainerAlignmentLog} allowEmptyData title="Alignment Log">
            <ContentBox padding>
              <LogViewer
                isStatic
                data={logData}
                customActions={[<AlignmentLogLink key="alignment-log-link" buildId={buildId!} isIconVariant />]}
              />
            </ContentBox>
          </ServiceContainerLoading>
        </ContentBox>
      )}

      {isBuilding && (
        <ContentBox>
          <EmptyStateCard title="Alignment Log" />
        </ContentBox>
      )}
    </>
  );
};
