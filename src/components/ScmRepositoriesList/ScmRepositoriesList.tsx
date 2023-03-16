import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { SCMRepository } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

// keeping also not supported operations for testing purposes
const filterOptions: IFilterOptions = {
  filterAttributes: {
    internalUrl: {
      id: 'internalUrl',
      title: 'Internal URL',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
    externalUrl: {
      id: 'externalUrl',
      title: 'External URL',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
  },
};

const sortOptions: ISortOptions = {
  internalUrl: {
    id: 'internalUrl',
    title: 'Internal URL',
    tableColumnIndex: 0,
  },
  externalUrl: {
    id: 'externalUrl',
    title: 'External URL',
    tableColumnIndex: 1,
  },
};

interface IScmRepositoriesListProps {
  serviceContainerScmRepositories: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of SCM Repositories.
 *
 * @param serviceContainerScmRepositories - Service Container for SCM Repositories
 * @param componentId - Component ID
 */
export const ScmRepositoriesList = ({ serviceContainerScmRepositories, componentId }: IScmRepositoriesListProps) => {
  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton action={() => console.log('Not implemented yet!')}>Create SCM Repository</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerScmRepositories} title={PageTitles.repositories}>
          <TableComposable variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th>Name</Th>
                <Th sort={getSortParams(sortOptions['internalUrl'].id)}>Internal SCM URL</Th>
                <Th sort={getSortParams(sortOptions['externalUrl'].id)}>External SCM URL</Th>
                <Th width={15}>Pre-build Sync</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerScmRepositories.data?.content.map((scmRepository: SCMRepository, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{<ScmRepositoryLink scmRepository={scmRepository} />}</Td>
                  <Td>{<ScmRepositoryUrl isInline showGerritButton url={scmRepository.internalUrl} />}</Td>
                  <Td>{scmRepository.externalUrl && <ScmRepositoryUrl isInline url={scmRepository.externalUrl} />}</Td>
                  <Td>
                    {scmRepository?.preBuildSyncEnabled !== undefined &&
                      (scmRepository.preBuildSyncEnabled ? 'enabled' : 'disabled')}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerScmRepositories.data?.totalHits} />
    </>
  );
};
