import { ToolbarItem } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';

const buildHistoryListFiltrableColumns = [
  buildEntityAttributes.status.id,
  buildEntityAttributes.startTime.id,
  buildEntityAttributes.temporaryBuild.id,
  buildEntityAttributes['user.username'].id,
];

interface IBuildHistoryListProps {
  serviceContainerBuilds: IServiceContainer;
  variant: 'Build' | 'Group Build';
  componentId: string;
}
/**
 * Component displaying Build or Group Build history.
 *
 * @param serviceContainerBuilds - Service Container for Builds or Group Builds
 * @param variant - Build or Group Build variant
 * @param componentId - Component ID
 */
export const BuildHistoryList = ({ serviceContainerBuilds, variant, componentId }: IBuildHistoryListProps) => {
  const entityAttributes = useMemo(() => (variant === 'Build' ? buildEntityAttributes : groupBuildEntityAttributes), [variant]);

  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: entityAttributes,
        defaultSorting: {
          attribute: entityAttributes.startTime.id,
          direction: 'desc',
        },
        customColumns: buildHistoryListFiltrableColumns,
      }),
    [entityAttributes]
  );

  useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes: entityAttributes,
                  defaultFiltering: { attribute: entityAttributes.status.id },
                  customColumns: buildHistoryListFiltrableColumns,
                }),
              [entityAttributes]
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.buildHistory}>
          <TableComposable isStriped variant="compact">
            <Tbody>
              {serviceContainerBuilds.data?.content.map((build: Build | GroupBuild, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <BuildStatus build={build} includeBuildLink />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuilds.data?.totalHits} pageSizeDefault="page15" />
    </>
  );
};
