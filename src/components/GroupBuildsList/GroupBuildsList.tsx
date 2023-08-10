import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ToolbarItem,
} from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';

import { GroupBuild } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildName } from 'components/BuildName/BuildName';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Username } from 'components/Username/Username';

import { areDatesEqual, calculateDuration, createDateTime } from 'utils/utils';

interface IGroupBuildsListProps {
  serviceContainerGroupBuilds: IServiceContainer;
  componentId: string;
}

export const GroupBuildsList = ({ serviceContainerGroupBuilds, componentId }: IGroupBuildsListProps) => {
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

  const { getSortParams, getSortGroupParams } = useSorting(sortOptions, componentId);

  const [isTimesSortDropdownOpen, setIsTimesSortDropdownOpen] = useState<boolean>(false);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes: groupBuildEntityAttributes,
                  defaultFiltering: { attribute: groupBuildEntityAttributes.status.id },
                }),
              []
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerGroupBuilds} title={PageTitles.groupBuilds}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes.status.id)}>
                  {groupBuildEntityAttributes.status.title}
                </Th>
                <Th width={35}>{groupBuildEntityAttributes.name.title}</Th>
                <Th width={30} className="overflow-visible">
                  <SortGroup
                    title="Times"
                    sort={getSortGroupParams(sortOptions.sortAttributes.startTime.id!)}
                    isDropdownOpen={isTimesSortDropdownOpen}
                    onDropdownToggle={() => setIsTimesSortDropdownOpen(!isTimesSortDropdownOpen)}
                  />
                </Th>
                <Th width={15} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                  {groupBuildEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerGroupBuilds.data?.content.map((groupBuild: GroupBuild, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <BuildStatusIcon build={groupBuild} long />
                  </Td>
                  <Td>
                    <BuildName build={groupBuild} includeBuildLink includeConfigLink long />
                  </Td>
                  <Td>
                    <DescriptionList className="gap-0" isHorizontal isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>{groupBuildEntityAttributes.startTime.title}</DescriptionListTerm>
                        <DescriptionListDescription>
                          {groupBuild.startTime && createDateTime({ date: groupBuild.startTime }).custom}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>{groupBuildEntityAttributes.endTime.title}</DescriptionListTerm>
                        <DescriptionListDescription>
                          {groupBuild.endTime &&
                            createDateTime({
                              date: groupBuild.endTime,
                              includeDateInCustom:
                                !groupBuild.startTime || !areDatesEqual(groupBuild.startTime, groupBuild.endTime),
                            }).custom}
                          {groupBuild.startTime &&
                            groupBuild.endTime &&
                            ` (took ${calculateDuration(groupBuild.startTime, groupBuild.endTime)})`}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </Td>
                  <Td>{groupBuild.user?.username && <Username text={groupBuild.user.username} />}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerGroupBuilds.data?.totalHits} />
    </>
  );
};
