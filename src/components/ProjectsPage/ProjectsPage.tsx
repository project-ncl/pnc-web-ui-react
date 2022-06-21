import { ProjectsList } from './../ProjectsList/ProjectsList';
import { PageLayout } from './../PageLayout/PageLayout';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { Label, ToolbarItem } from '@patternfly/react-core';
import { Pagination } from '../Pagination/Pagination';
import { useQueryParamsEffect } from '../../containers/useQueryParamsEffect';
import { Filtering, IFilterOptions } from '../Filtering/Filtering';
import { Toolbar } from '../Toolbar/Toolbar';
import { useTitle } from '../../containers/useTitle';
import { PageTitles } from '../../utils/PageTitles';

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
          <Filtering filterOptions={filterOptions} componentId={componentId} />
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
