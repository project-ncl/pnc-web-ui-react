import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/PageTitles';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectsList } from 'components/ProjectsList/ProjectsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { ISortOptions, Sorting } from 'components/Sorting/Sorting';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as projectApi from 'services/projectApi';

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

interface IProjectPage {
  componentId?: string;
}

export const ProjectsPage = ({ componentId = 'p1' }: IProjectPage) => {
  const serviceContainerProjects = useServiceContainer(({ requestConfig }: IService) => projectApi.getProjects(requestConfig));

  useTitle(PageTitles.projects);

  useQueryParamsEffect((requestConfig: Object) => {
    serviceContainerProjects.refresh({ requestConfig });
  }, componentId);

  return (
    <PageLayout
      title={PageTitles.projects}
      description={
        <>
          This page contains a standalone projects like <Label>Hibernate</Label> or <Label>JBoss Modules</Label>, usually a
          project represents one SCM repository and one project may contain multiple Build Configs.
        </>
      }
    >
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
        <ToolbarItem>
          <Sorting sortOptions={sortOptions} componentId={componentId} />
        </ToolbarItem>
        <ToolbarItem alignRight={true}>
          <ProtectedComponent>
            <ActionButton iconType="create" link="create">
              Create
            </ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ServiceContainerLoading {...serviceContainerProjects} title={`${PageTitles.projects} List`}>
        <ProjectsList projects={serviceContainerProjects.data?.content} />
      </ServiceContainerLoading>
      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerProjects.data?.totalHits} />
    </PageLayout>
  );
};
