import { useCallback, useMemo } from 'react';

import { Build } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { hasBuildStarted, hasBuildStatusChanged, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as buildApi from 'services/buildApi';

import { refreshPage } from 'utils/refreshHelper';
import { debounce } from 'utils/utils';

interface IBuildsPageProps {
  componentId?: string;
}

export const BuildsPage = ({ componentId = 'b1' }: IBuildsPageProps) => {
  const serviceContainerBuilds = useServiceContainer(buildApi.getBuilds);

  const { componentQueryParamsObject: buildsQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuildsRunner = serviceContainerBuilds.run;
  const serviceContainerBuildsSetter = serviceContainerBuilds.setData;

  const serviceContainerBuildsRunnerDebounced = useMemo(
    () => debounce(serviceContainerBuildsRunner),
    [serviceContainerBuildsRunner]
  );

  useQueryParamsEffect(serviceContainerBuildsRunner, { componentId });

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData)) {
          serviceContainerBuildsRunnerDebounced({ requestConfig: { params: buildsQueryParamsObject } });
        } else if (hasBuildStatusChanged(wsData)) {
          const wsBuild: Build = wsData.build;
          serviceContainerBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerBuildsRunnerDebounced, serviceContainerBuildsSetter, buildsQueryParamsObject]
    ),
    // NCL-8377
    { debug: 'BuildsPage' }
  );

  useTitle(PageTitles.builds);

  return (
    <PageLayout
      title={PageTitles.builds}
      description={
        <>
          This page contains all Builds. Build is a unit produced by the Build Config during the build process. It includes all
          Artifacts that were produced by the Build and all Artifacts (Dependencies) that were used to build it.
        </>
      }
    >
      <BuildsList {...{ serviceContainerBuilds, componentId }} />
    </PageLayout>
  );
};
