import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { AlignmentLogLink } from 'components/AlignmentLogLink/AlignmentLogLink';
import { LOG_VIEWER_HEIGHT_OFFSET } from 'components/BuildLogPage/BuildLogPage';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { EmptyStateCard } from 'components/StateCard/EmptyStateCard';

import * as buildApi from 'services/buildApi';

export const BuildAlignmentLogPage = () => {
  const { buildId } = useParamsRequired();

  const { isBuilding } = useServiceContainerBuild();

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
        <ServiceContainerLoading {...serviceContainerAlignmentLog} allowEmptyData title="Alignment Log">
          <LogViewer
            isStatic
            data={logData}
            customActions={[<AlignmentLogLink key="alignment-log-link" buildId={buildId!} isIconVariant />]}
            heightOffset={LOG_VIEWER_HEIGHT_OFFSET}
            autofocusSearchBar
          />
        </ServiceContainerLoading>
      )}

      {isBuilding && <EmptyStateCard title="Alignment Log" />}
    </>
  );
};
