import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

// keeping also not supported operations for testing purposes
const filterOptions: IFilterOptions = {
  filterAttributes: {
    name: {
      id: 'name',
      title: 'Name',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    description: {
      id: 'description',
      title: 'Description',
      operator: '=like=',
    },
    customb: {
      id: 'customb',
      title: 'Custom',
      isCustomParam: true,
      operator: '=like=',
    },
    status: {
      id: 'status',
      title: 'Status',
      filterValues: ['SUCCESS', 'REJECTED', 'FAILED', 'CANCELLED', 'BUILDING', 'NO_REBUILD_REQUIRED', 'SYSTEM_ERROR'],
      operator: '==',
    },
  },
};

const sortOptions: ISortOptions = {
  name: {
    id: 'name',
    title: 'Name',
    tableColumnIndex: 0,
  },
  description: {
    id: 'description',
    title: 'Description',
    tableColumnIndex: 1,
  },
};

interface IProjectsList {
  serviceContainerProjects: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Projects.
 *
 * @param serviceContainerProjects - Service Container for Projects
 * @param componentId - Component ID
 */
export const ProjectsList = ({ serviceContainerProjects, componentId }: IProjectsList) => {
  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProjects} title={PageTitles.projects}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={30} sort={getSortParams(sortOptions['name'].id)}>
                  Name
                </Th>
                <Th sort={getSortParams(sortOptions['description'].id)}>Description</Th>
                <Th width={15}>Build Configs count</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProjects.data?.content.map((project: Project, rowIndex: number) => (
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
        </ServiceContainerLoading>
      </ContentBox>

      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerProjects.data?.totalHits} />
    </>
  );
};
