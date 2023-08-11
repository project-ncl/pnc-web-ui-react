import { TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getSortOptions } from 'common/entityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface IBuildHistoryListProps {
  serviceContainerBuilds: IServiceContainer;
  componentId: string;
}
/**
 * Component displaying Build history or Group Build history.
 *
 * @param serviceContainerBuilds - Service Container for Builds or Group Builds
 * @param componentId - Component ID
 */
export const BuildHistoryList = ({ serviceContainerBuilds, componentId }: IBuildHistoryListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: groupBuildEntityAttributes,
        defaultSorting: {
          attribute: groupBuildEntityAttributes.startTime.id,
          direction: 'desc',
        },
      }),
    []
  );
  useSorting(sortOptions, componentId);
  return (
    <>
      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.buildHistory}>
          <TableComposable isStriped variant="compact">
            <Tbody>
              {serviceContainerBuilds.data?.content.map((Build: Build | GroupBuild, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <BuildStatus build={Build} includeBuildLink />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuilds.data?.totalHits} pageSizeDefault={20} />
    </>
  );
};
