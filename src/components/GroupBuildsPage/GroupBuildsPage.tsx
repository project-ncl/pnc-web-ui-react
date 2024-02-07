import { useCallback } from 'react';

import { GroupBuild } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { hasGroupBuildStarted, hasGroupBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { GroupBuildsList } from 'components/GroupBuildsList/GroupBuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as groupBuildApi from 'services/groupBuildApi';

import { refreshPage } from 'utils/refreshHelper';

export const GroupBuildsPage = ({ componentId = 'gb1' }) => {
  const serviceContainerGroupBuilds = useServiceContainer(groupBuildApi.getGroupBuilds);

  const { componentQueryParamsObject: groupBuildsQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerGroupBuildsRunner = serviceContainerGroupBuilds.run;
  const serviceContainerGroupBuildsSetter = serviceContainerGroupBuilds.setData;

  useQueryParamsEffect(serviceContainerGroupBuildsRunner, { componentId });

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasGroupBuildStarted(wsData)) {
          serviceContainerGroupBuildsRunner({ requestConfig: { params: groupBuildsQueryParamsObject } });
        } else if (hasGroupBuildStatusChanged(wsData)) {
          const wsGroupBuild: GroupBuild = wsData.groupBuild;
          serviceContainerGroupBuildsSetter((previousGroupBuildPage) => refreshPage(previousGroupBuildPage!, wsGroupBuild));
        }
      },
      [serviceContainerGroupBuildsRunner, serviceContainerGroupBuildsSetter, groupBuildsQueryParamsObject]
    )
  );

  useTitle(PageTitles.groupBuilds);

  return (
    <PageLayout
      title={PageTitles.groupBuilds}
      description={
        <>
          This page contains all Group Builds. Group Build is unit produced by Group Config during the build process. Usually one
          Group Build may contain multiple Builds.
        </>
      }
    >
      <GroupBuildsList {...{ serviceContainerGroupBuilds, componentId }} />
    </PageLayout>
  );
};
