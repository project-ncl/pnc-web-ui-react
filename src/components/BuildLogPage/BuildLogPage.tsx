import { useEffect, useMemo } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildLogLink } from 'components/BuildLogLink/BuildLogLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

export const LOG_VIEWER_HEIGHT_OFFSET = -90;

export const BuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const serviceContainerBuildLog = useServiceContainer(buildApi.getBuildLog);
  const serviceContainerBuildLogRunner = serviceContainerBuildLog.run;

  const logData = useMemo(() => serviceContainerBuildLog.data?.split(/[\r\n]/) || [], [serviceContainerBuildLog.data]);

  useEffect(() => {
    serviceContainerBuildLogRunner({ serviceData: { id: buildId } });
  }, [serviceContainerBuildLogRunner, buildId]);

  const logActions = [<BuildLogLink key="log-link" isIconVariant buildId={buildId!} />];

  return (
    <ContentBox>
      <ServiceContainerLoading {...serviceContainerBuildLog} allowEmptyData title="Build Log">
        <ContentBox padding>
          <LogViewer
            isStatic
            data={logData}
            customActions={logActions}
            heightOffset={LOG_VIEWER_HEIGHT_OFFSET}
            autofocusSearchBar
          />
        </ContentBox>
      </ServiceContainerLoading>
    </ContentBox>
  );
};
