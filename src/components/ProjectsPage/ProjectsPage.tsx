import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ProtectedActionButton } from 'components/ActionButton/ActionButton';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProjectsList } from 'components/ProjectsList/ProjectsList';

import * as projectApi from 'services/projectApi';

interface IProjectPage {
  componentId?: string;
}

export const ProjectsPage = ({ componentId = 'p1' }: IProjectPage) => {
  const serviceContainerProjects = useServiceContainer(projectApi.getProjects);

  useQueryParamsEffect(serviceContainerProjects.run, { componentId });

  useTitle(PageTitles.projects);

  return (
    <PageLayout
      title={PageTitles.projects}
      description={
        <>
          This page contains a standalone projects like <Label>Hibernate</Label> or <Label>JBoss Modules</Label>, usually a
          project represents one SCM repository and one project may contain multiple Build Configs.
        </>
      }
      actions={
        <ProtectedActionButton variant="primary" link="create">
          Create Project
        </ProtectedActionButton>
      }
    >
      <ProjectsList {...{ serviceContainerProjects, componentId }} />
    </PageLayout>
  );
};
