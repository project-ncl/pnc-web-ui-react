import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IProjectsList {
  projects: Project[];
}

/**
 * Dump component displaying list of Projects.
 *
 * @param projects - List of Projects to be displayed
 */
export const ProjectsList = ({ projects }: IProjectsList) => {
  return (
    <TableComposable variant="compact">
      <Thead>
        <Tr>
          <Th width={30}>Name</Th>
          <Th>Description</Th>
          <Th width={15}>Build Configs count</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {projects.map((project: Project, rowIndex: number) => (
          <Tr key={rowIndex}>
            <Td>{<ProjectLink id={project.id}>{project.name}</ProjectLink>}</Td>
            <Td>{project.description}</Td>
            <Td>{Object.keys(project.buildConfigs || []).length}</Td>
            <Td>
              <ProtectedComponent>
                <Link to={`${project.id}/edit`}>edit</Link>
              </ProtectedComponent>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};
