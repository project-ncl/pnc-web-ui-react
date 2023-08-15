import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { GroupBuildsList } from 'components/GroupBuildsList/GroupBuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as groupBuildApi from 'services/groupBuildApi';

export const GroupBuildsPage = ({ componentId = 'gb1' }) => {
  const serviceContainerGroupBuilds = useServiceContainer(groupBuildApi.getGroupBuilds);

  useQueryParamsEffect(serviceContainerGroupBuilds.run, { componentId });

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
