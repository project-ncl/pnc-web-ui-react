import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ToolbarItem,
} from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';

import { GroupBuildPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildName } from 'components/BuildName/BuildName';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Username } from 'components/Username/Username';

import { areDatesEqual, calculateDuration, checkColumnsCombinations } from 'utils/utils';

type TColumns = Array<keyof typeof groupBuildEntityAttributes>;

interface IGroupBuildsListProps {
  serviceContainerGroupBuilds: IServiceContainerState<GroupBuildPage>;
  columns?: TColumns;
  componentId: string;
}

const defaultColumns: TColumns = [
  groupBuildEntityAttributes.status.id,
  groupBuildEntityAttributes.name.id,
  groupBuildEntityAttributes.startTime.id,
  groupBuildEntityAttributes.endTime.id,
  groupBuildEntityAttributes['user.username'].id,
];

export const GroupBuildsList = ({
  serviceContainerGroupBuilds,
  columns = defaultColumns,
  componentId,
}: IGroupBuildsListProps) => {
  checkColumnsCombinations({
    columns,
    combinations: [[groupBuildEntityAttributes.startTime.id, groupBuildEntityAttributes.endTime.id]],
  });

  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: groupBuildEntityAttributes,
        defaultSorting: {
          attribute: groupBuildEntityAttributes.startTime.id,
          direction: 'desc',
        },
        customColumns: columns,
      }),
    [columns]
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
                {columns.includes(groupBuildEntityAttributes.status.id) && (
                  <Th width={20} sort={getSortParams(sortOptions.sortAttributes.status.id)}>
                    {groupBuildEntityAttributes.status.title}
                  </Th>
                )}

                {columns.includes(groupBuildEntityAttributes.name.id) && (
                  <Th width={35}>{groupBuildEntityAttributes.name.title}</Th>
                )}

                {columns.includes(groupBuildEntityAttributes.startTime.id) &&
                  columns.includes(groupBuildEntityAttributes.endTime.id) && (
                    <Th width={30} className="overflow-visible">
                      <SortGroup
                        title="Times"
                        sort={getSortGroupParams(sortOptions.sortAttributes.startTime.id!)}
                        isDropdownOpen={isTimesSortDropdownOpen}
                        onDropdownToggle={() => setIsTimesSortDropdownOpen(!isTimesSortDropdownOpen)}
                      />
                    </Th>
                  )}

                {columns.includes(groupBuildEntityAttributes['user.username'].id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                    {groupBuildEntityAttributes['user.username'].title}
                  </Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerGroupBuilds.data?.content?.map((groupBuild, rowIndex) => (
                <Tr key={rowIndex}>
                  {columns.includes(groupBuildEntityAttributes.status.id) && (
                    <Td>
                      <BuildStatusIcon build={groupBuild} long />
                    </Td>
                  )}
                  {columns.includes(groupBuildEntityAttributes.name.id) && (
                    <Td>
                      <BuildName build={groupBuild} includeBuildLink includeConfigLink long />
                    </Td>
                  )}
                  {columns.includes(groupBuildEntityAttributes.startTime.id) &&
                    columns.includes(groupBuildEntityAttributes.endTime.id) && (
                      <Td>
                        <DescriptionList className="gap-0" isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{groupBuildEntityAttributes.startTime.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {groupBuild.startTime && <DateTime date={groupBuild.startTime} />}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{groupBuildEntityAttributes.endTime.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {groupBuild.endTime && (
                                <DateTime
                                  date={groupBuild.endTime}
                                  displayDate={!groupBuild.startTime || !areDatesEqual(groupBuild.startTime, groupBuild.endTime)}
                                />
                              )}
                              {groupBuild.startTime &&
                                groupBuild.endTime &&
                                ` (took ${calculateDuration(groupBuild.startTime, groupBuild.endTime)})`}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </Td>
                    )}
                  {columns.includes(groupBuildEntityAttributes['user.username'].id) && (
                    <Td>{groupBuild.user?.username && <Username text={groupBuild.user.username} />}</Td>
                  )}
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
