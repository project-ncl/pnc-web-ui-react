import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { SCMRepository } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';
import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

const sortAttributes: ISortAttributes = {
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
  const { getSortParams } = useSorting(sortAttributes, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(scmRepositoryEntityAttributes)} componentId={componentId} />{' '}
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerScmRepositories} title={PageTitles.scmRepositories}>
          <TableComposable variant="compact" isStriped>
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={20}>Name</Th>
                <Th width={30} sort={getSortParams(sortAttributes['internalUrl'].id)}>
                  {scmRepositoryEntityAttributes.internalUrl.title}
                  <TooltipWrapper tooltip={scmRepositoryEntityAttributes.internalUrl.tooltip} />
                </Th>
                <Th width={30} sort={getSortParams(sortAttributes['externalUrl'].id)}>
                  {scmRepositoryEntityAttributes.externalUrl.title}
                  <TooltipWrapper tooltip={scmRepositoryEntityAttributes.externalUrl.tooltip} />
                </Th>
                <Th width={10}>
                  {scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
                  <TooltipWrapper tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerScmRepositories.data?.content.map((scmRepository: SCMRepository, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{<ScmRepositoryLink scmRepository={scmRepository} />}</Td>
                  <Td>{<ScmRepositoryUrl isInline internalScmRepository={scmRepository} />}</Td>
                  <Td>{scmRepository.externalUrl && <ScmRepositoryUrl isInline externalScmRepository={scmRepository} />}</Td>
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
