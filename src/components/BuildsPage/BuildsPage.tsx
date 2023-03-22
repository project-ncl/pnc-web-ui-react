import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as buildApi from 'services/buildApi';

interface IBuildsPageProps {
  componentId?: string;
}

export const BuildsPage = ({ componentId = 'b1' }: IBuildsPageProps) => {
  const serviceContainerBuilds = useServiceContainer(buildApi.getBuilds);

  useQueryParamsEffect(serviceContainerBuilds.run, { componentId });

  useTitle(PageTitles.builds);

  return (
    <PageLayout
      title={PageTitles.builds}
      description={
        <>
          Build is a unit produced by the Build Config during the build process. It includes all Artifacts that were produced by
          the Build and all Artifacts (Dependencies) that were used to build it.
        </>
      }
    >
      <BuildsList {...{ serviceContainerBuilds, componentId }} />
    </PageLayout>
  );
};
