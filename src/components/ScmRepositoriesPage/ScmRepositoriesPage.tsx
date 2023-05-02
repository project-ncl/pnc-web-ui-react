import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ScmRepositoriesList } from 'components/ScmRepositoriesList/ScmRepositoriesList';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

interface IScmRepositoriesPage {
  componentId?: string;
}

export const ScmRepositoriesPage = ({ componentId = 's1' }: IScmRepositoriesPage) => {
  const serviceContainerScmRepositories = useServiceContainer(scmRepositoryApi.getScmRepositories);

  useQueryParamsEffect(serviceContainerScmRepositories.run, { componentId });

  useTitle(PageTitles.scmRepositories);
  return (
    <PageLayout
      title={PageTitles.scmRepositories}
      description={
        <>
          This page contains SCM Repositories like <Label>apache/maven.git</Label> or <Label>git/twitter4j.git</Label>, they are
          either created by new build config wizard or manually created here.
        </>
      }
      actions={
        <ProtectedComponent>
          <ActionButton link="create">Create SCM Repository</ActionButton>
        </ProtectedComponent>
      }
    >
      <ScmRepositoriesList {...{ serviceContainerScmRepositories, componentId }} />
    </PageLayout>
  );
};
