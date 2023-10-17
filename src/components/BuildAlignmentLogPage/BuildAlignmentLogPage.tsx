import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { AlignmentLogLink } from 'components/AlignmentLogLink/AlignmentLogLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

export const BuildAlignmentLogPage = () => {
  const { buildId } = useParamsRequired();

  const serviceContainerAlignmentLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerAlignmentLogRunner = serviceContainerAlignmentLog.run;

  const logData = useMemo(() => serviceContainerAlignmentLog.data?.split(/[\r\n]/) || [], [serviceContainerAlignmentLog.data]);

  useEffect(() => {
    serviceContainerAlignmentLogRunner({ serviceData: { id: buildId } });
  }, [serviceContainerAlignmentLogRunner, buildId]);

  return (
    <ContentBox>
      <ServiceContainerLoading {...serviceContainerAlignmentLog} allowEmptyData title="Alignment Log">
        <ContentBox padding>
          <LogViewer isStatic data={logData} customActions={[<AlignmentLogLink buildId={buildId!} />]} />
        </ContentBox>
      </ServiceContainerLoading>
    </ContentBox>
  );
};
