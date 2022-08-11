import { Label, ToolbarItem } from '@patternfly/react-core';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { useQueryParamsEffect } from '../../containers/useQueryParamsEffect';
import { useTitle } from '../../containers/useTitle';

import { projectService } from '../../services/projectService';

import { PageTitles } from '../../utils/PageTitles';

import { ActionButton } from '../ActionButton/ActionButton';
import { Filtering, IFilterOptions } from '../Filtering/Filtering';
import { Pagination } from '../Pagination/Pagination';
import { ProtectedComponent } from '../ProtectedContent/ProtectedComponent';
import { Toolbar } from '../Toolbar/Toolbar';
import { PageLayout } from './../PageLayout/PageLayout';
import { ProjectsList } from './../ProjectsList/ProjectsList';

interface IProjectPage {
  componentId?: string;
}

export const ProjectsPage = ({ componentId = 'p1' }: IProjectPage) => {
  const dataContainer = useDataContainer(({ requestConfig }: IService) => projectService.getProjects(requestConfig));

  useTitle(PageTitles.projects);

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

  const ToolbarItemWidths = {
    default: '100%',
  };

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
      <Toolbar>
        <ToolbarItem widths={ToolbarItemWidths}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Filtering filterOptions={filterOptions} componentId={componentId} />
            </FlexItem>
            <FlexItem>
              <ProtectedComponent>
                <ActionButton iconType="create" link="create">
                  Create
                </ActionButton>
              </ProtectedComponent>
            </FlexItem>
          </Flex>
        </ToolbarItem>
      </Toolbar>

      <DataContainer {...dataContainer} title="Projects List">
        <ProjectsList projects={dataContainer.data?.content} />
      </DataContainer>
      {/* Pagination need to be outside of DataContainer so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={dataContainer.data?.totalHits} />
    </PageLayout>
  );
};
