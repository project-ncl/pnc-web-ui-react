import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { SCMRepositoryPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ScmRepositoryLink } from 'components/ScmRepositoryLink/ScmRepositoryLink';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface IScmRepositoriesListProps {
  serviceContainerScmRepositories: IServiceContainerState<SCMRepositoryPage>;
  componentId: string;
}

/**
 * Component displaying list of SCM Repositories.
 *
 * @param serviceContainerScmRepositories - Service Container for SCM Repositories
 * @param componentId - Component ID
 */
export const ScmRepositoriesList = ({ serviceContainerScmRepositories, componentId }: IScmRepositoriesListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: scmRepositoryEntityAttributes,
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(() => getFilterOptions({ entityAttributes: scmRepositoryEntityAttributes }), [])}
            componentId={componentId}
          />{' '}
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
                <Th width={20}>
                  {scmRepositoryEntityAttributes.name.title}
                  <TooltipWrapper tooltip={scmRepositoryEntityAttributes.name.tooltip} />
                </Th>
                <Th width={30} sort={getSortParams(sortOptions.sortAttributes['externalUrl'].id)}>
                  {scmRepositoryEntityAttributes.externalUrl.title}
                  <TooltipWrapper tooltip={scmRepositoryEntityAttributes.externalUrl.tooltip} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerScmRepositories.data?.content?.map((scmRepository, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>{<ScmRepositoryLink scmRepository={scmRepository} />}</Td>
                  <Td>{scmRepository.externalUrl && <ScmRepositoryUrl isInline externalScmRepository={scmRepository} />}</Td>
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
