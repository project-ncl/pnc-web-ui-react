import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as artifactApi from 'services/artifactApi';

interface IArtifactsPageProps {
  componentId?: string;
}

export const ArtifactsPage = ({ componentId = 'a1' }: IArtifactsPageProps) => {
  const serviceContainerArtifacts = useServiceContainer(artifactApi.getArtifacts);

  useQueryParamsEffect(serviceContainerArtifacts.run, { componentId });

  useTitle(PageTitles.artifacts);

  return (
    <PageLayout
      title={PageTitles.artifacts}
      description={
        <>
          This page contains Artifacts used and produced by Builds, Artifact is represented by PNC Identifier and it may be for
          example <label>pom</label>, <label>jar</label> or an archive like <label>tgz</label>.
        </>
      }
    >
      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />
    </PageLayout>
  );
};
