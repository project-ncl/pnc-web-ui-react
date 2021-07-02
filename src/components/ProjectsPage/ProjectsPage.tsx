import { ProjectsList } from './../ProjectsList/ProjectsList';
import { PageLayout } from './../PageLayout/PageLayout';

export const ProjectsPage = () => {
  return (
    <PageLayout title="ProjectsPage Title" description="Projects Page description ...">
      <ProjectsList />
    </PageLayout>
  );
};
