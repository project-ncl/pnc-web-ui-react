import '@patternfly/react-core/dist/styles/base.css';

import { Table, TableHeader, TableBody, cellWidth } from '@patternfly/react-table';
import { Project } from 'pnc-api-types-ts';

import { Link } from 'react-router-dom';

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
  ];

  const rows = projects.map((project: Project) => [
    {
      title: <Link to="#">{project.name}</Link>,
    },
    project.description,
    Object.keys(project.buildConfigs || []).length,
  ]);

  return (
    <Table aria-label="Projects List" variant="compact" borders={false} cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
