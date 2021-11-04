import { ProjectsList } from './../ProjectsList/ProjectsList';
import { PageLayout } from './../PageLayout/PageLayout';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { Label } from '@patternfly/react-core';

export const ProjectsPage = () => {
  const dataContainer = useDataContainer(() => projectService.getProjects());

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
        <ProjectsList projects={dataContainer.data} />
      </DataContainer>
    </PageLayout>
  );
};
