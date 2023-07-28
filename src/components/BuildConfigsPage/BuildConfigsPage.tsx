import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigsPageProps {
  componentId?: string;
}

export const BuildConfigsPage = ({ componentId = 'b1' }: IBuildConfigsPageProps) => {
  const serviceContainerBuildConfigs = useServiceContainer(buildConfigApi.getBuildConfigsWithLatestBuild);

  useQueryParamsEffect(serviceContainerBuildConfigs.run, { componentId });

  useTitle(PageTitles.buildConfigs);

  return (
    <PageLayout
      title={PageTitles.buildConfigs}
      description={
        <>
          This page contains all Build Configs. Build Config contains all the information required to build a particular Project
          and it produces Build during the build process.
        </>
      }
    >
      <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />
    </PageLayout>
  );
};
