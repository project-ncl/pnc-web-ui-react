import { ProjectsList } from './../ProjectsList/ProjectsList';
import { PageLayout } from './../PageLayout/PageLayout';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { Label } from '@patternfly/react-core';
import { Pagination } from '../Pagination/Pagination';
import { useQueryParamsEffect } from '../../containers/useQueryParamsEffect';

interface IProjectPage {
  componentId?: string;
}

export const ProjectsPage = ({ componentId = 'projectsPage' }: IProjectPage) => {
  const dataContainer = useDataContainer((requestConfig: Object) => projectService.getProjects(requestConfig));

  useQueryParamsEffect((requestConfig: Object) => {
    dataContainer.refresh(requestConfig);
  }, componentId);

  return (
    <PageLayout
      title="Projects"
      description={
        <>
          This page contains a standalone projects like <Label>Hibernate</Label> or <Label>JBoss Modules</Label>, usually a
          project represents one SCM repository and one project may contain multiple Build Configs.
        </>
      }
    >
      <DataContainer {...dataContainer} title="Projects List">
        <ProjectsList projects={dataContainer.data?.content} />
      </DataContainer>
      {/* Pagination need to be outside of DataContainer so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={dataContainer.data?.totalHits} />
    </PageLayout>
  );
};
