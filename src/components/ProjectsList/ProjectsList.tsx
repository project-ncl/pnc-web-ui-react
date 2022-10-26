import { TableComposable, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { useSorting } from 'containers/useSorting';

import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { SORT_ORDER } from 'components/Sorting/Sorting';

import { getComponentQueryParamValue } from 'utils/queryParamsHelper';

const columnNames = { name: 'Name', description: 'Description', buildConfigsCnt: 'Build Configs count', actions: 'Actions' };

interface IProjectsList {
  projects: Project[];
  componentId: string;
  sorting: ReturnType<typeof useSorting>;
}

/**
 * Component displaying list of Projects.
 *
 * @param projects    - list of Projects to be displayed
 * @param componentId - url id of component
 * @param sorting     - object returned by useSorting hook
 */
export const ProjectsList = ({ projects, componentId, sorting }: IProjectsList) => {
  const location = useLocation();

  const [activeSortIndex, setActiveSortIndex] = useState<number>();
  const [activeSortDirection, setActiveSortDirection] = useState<'asc' | 'desc'>();

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      sorting.addSortFilter(Object.keys(columnNames)[index], direction.toString() as SORT_ORDER);
    },
    columnIndex,
  });

  useEffect(() => {
    const currentSortParam = getComponentQueryParamValue(location.search, 'sort', componentId);

    if (currentSortParam) {
      if (currentSortParam === 'none') {
        setActiveSortIndex(undefined);
      } else {
        const currentSortParamSplitted = currentSortParam.split('=');
        currentSortParamSplitted.shift(); // remove empty string

        const [urlSortOrder, urlSortAttributeKey] = currentSortParamSplitted;
        setActiveSortDirection(urlSortOrder as SORT_ORDER);
        setActiveSortIndex(Object.keys(columnNames).indexOf(urlSortAttributeKey));
      }
    }
  }, [location.search, componentId]);

  return (
    <TableComposable variant="compact" aria-label="Projects List" borders={false}>
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)} width={30}>
            {columnNames.name}
          </Th>
          <Th sort={getSortParams(1)}>{columnNames.description}</Th>
          <Th width={15}>{columnNames.buildConfigsCnt}</Th>
          <Th>{columnNames.actions}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {projects.map((project: Project) => (
          <Tr>
            <Td dataLabel={columnNames.name}>
              <ProjectLink id={project.id}>{project.name}</ProjectLink>
            </Td>
            <Td dataLabel={columnNames.description}>{project.description}</Td>
            <Td dataLabel={columnNames.buildConfigsCnt}>{Object.keys(project.buildConfigs || []).length}</Td>
            <Td dataLabel={columnNames.name}>
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
