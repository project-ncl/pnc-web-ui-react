import { Flex, FlexItem, FlexProps, Label } from '@patternfly/react-core';

import { DataContainer } from 'containers/DataContainer/DataContainer';
import { IService, useDataContainer } from 'containers/DataContainer/useDataContainer';
import { useQueryParamsEffect } from 'containers/useQueryParamsEffect';
import { useSorting } from 'containers/useSorting';
import { useTitle } from 'containers/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { ListToolbar } from 'components/ListToolbar/ListToolbar';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectsList } from 'components/ProjectsList/ProjectsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ISortOptions, Sorting } from 'components/Sorting/Sorting';

import * as projectService from 'services/projectService';

import { PageTitles } from 'utils/PageTitles';

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
  },
  description: {
    id: 'description',
    title: 'Description',
  },
};

const flexJustifyContent: FlexProps['justifyContent'] = { default: 'justifyContentSpaceBetween' };
const flexSpaceItems: FlexProps['spaceItems'] = { default: 'spaceItems2xl' };

interface IProjectPage {
  componentId?: string;
}

export const ProjectsPage = ({ componentId = 'p1' }: IProjectPage) => {
  const dataContainer = useDataContainer(({ requestConfig }: IService) => projectService.getProjects(requestConfig));

  const sorting = useSorting(sortOptions, componentId);

  useTitle(PageTitles.projects);

  useQueryParamsEffect((requestConfig: Object) => {
    dataContainer.refresh({ requestConfig });
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
      <ListToolbar>
        <Flex justifyContent={flexJustifyContent}>
          <Flex spaceItems={flexSpaceItems}>
            <FlexItem>
              <Filtering filterOptions={filterOptions} componentId={componentId} />
            </FlexItem>
            <FlexItem>
              <Sorting sorting={sorting} sortOptions={sortOptions} componentId={componentId} />
            </FlexItem>
          </Flex>
          <FlexItem>
            <ProtectedComponent>
              <ActionButton iconType="create" link="create">
                Create
              </ActionButton>
            </ProtectedComponent>
          </FlexItem>
        </Flex>
      </ListToolbar>

      <DataContainer {...dataContainer} title="Projects List">
        <ProjectsList projects={dataContainer.data?.content} />
      </DataContainer>
      {/* Pagination need to be outside of DataContainer so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={dataContainer.data?.totalHits} />
    </PageLayout>
  );
};
