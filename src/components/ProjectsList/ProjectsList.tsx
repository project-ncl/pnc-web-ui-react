import '@patternfly/react-core/dist/styles/base.css';
import '../../index.css';

import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
import { Project } from 'pnc-api-types-ts';
import { Link } from 'react-router-dom';
import { keycloakService } from '../../services/keycloakService';

import { ProjectLink } from '../ProjectLink/ProjectLink';

interface IProjectsList {
  projects: Project[];
}

/**
 * Dump component displaying list of Projects.
 *
 * @param projects - List of Projects to be displayed
 */
export const ProjectsList = ({ projects }: IProjectsList) => {
  const columns = [
    { title: 'Name', transforms: [cellWidth(30)] },
    'Description',
    { title: 'Build Configs count', transforms: [cellWidth(15)] },
    'Actions',
  ];

  const rows = projects.map((project: Project) => [
    {
      title: <ProjectLink id={project.id}>{project.name}</ProjectLink>,
    },
    project.description,
    Object.keys(project.buildConfigs || []).length,
    {
      title: (
        <Link className={keycloakService.isKeycloakAvailable ? '' : 'disabled-content'} to={`${project.id}/edit`}>
          edit
        </Link>
      ),
    },
  ]);

  return (
    <Table aria-label="Projects List" variant="compact" borders={false} cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
