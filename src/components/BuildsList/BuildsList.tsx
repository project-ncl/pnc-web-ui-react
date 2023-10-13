import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Build } from 'pnc-api-types-ts';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

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
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';
import { Username } from 'components/Username/Username';

import { areDatesEqual, calculateDuration, createDateTime } from 'utils/utils';

type TColumns = Array<keyof typeof buildEntityAttributes>;

const defaultColumns: TColumns = [
  buildEntityAttributes.status.id,
  buildEntityAttributes.id.id,
  buildEntityAttributes.name.id,
  buildEntityAttributes.submitTime.id,
  buildEntityAttributes.startTime.id,
  buildEntityAttributes.endTime.id,
  buildEntityAttributes['user.username'].id,
];

interface IBuildsListProps {
  serviceContainerBuilds: IServiceContainer;
  columns?: TColumns;
  componentId: string;
}

/**
 * Component displaying list of Builds.
 *
 * @param serviceContainerBuilds - Service Container for Builds
 * @param columns - The columns to be displayed
 * @param componentId - Component ID
 */
export const BuildsList = ({ serviceContainerBuilds, columns = defaultColumns, componentId }: IBuildsListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: buildEntityAttributes,
        defaultSorting: {
          attribute: buildEntityAttributes.submitTime.id,
          direction: 'desc',
        },
        customColumns: columns,
      }),
    [columns]
  );

  const { getSortParams, getSortGroupParams } = useSorting(sortOptions, componentId);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes: buildEntityAttributes,
                  defaultFiltering: { attribute: buildEntityAttributes.status.id },
                  customColumns: columns,
                }),
              [columns]
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.builds}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                {columns.includes(buildEntityAttributes.status.id) && (
                  <Th width={20} sort={getSortParams(sortOptions.sortAttributes.status.id)}>
                    {buildEntityAttributes.status.title}
                  </Th>
                )}
                {columns.includes(buildEntityAttributes.id.id) && (
                  <Th width={15}>
                    {buildEntityAttributes.id.title} <TooltipWrapper tooltip={buildEntityAttributes.id.tooltip} />
                  </Th>
                )}
                {columns.includes(buildEntityAttributes.name.id) && (
                  <Th width={35}>
                    {buildEntityAttributes.name.title} <TooltipWrapper tooltip={buildEntityAttributes.name.tooltip} />
                  </Th>
                )}
                {columns.includes(buildEntityAttributes.submitTime.id) &&
                  columns.includes(buildEntityAttributes.startTime.id) &&
                  columns.includes(buildEntityAttributes.endTime.id) && (
                    <Th width={20} className="overflow-visible">
                      <SortGroup
                        title="Times"
                        sort={getSortGroupParams(sortOptions.sortAttributes['submitTime'].id!)}
                        isDropdownOpen={isSortDropdownOpen}
                        onDropdownToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      />
                    </Th>
                  )}
                {columns.includes(buildEntityAttributes['user.username'].id) && (
                  <Th width={10} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                    {buildEntityAttributes['user.username'].title}
                  </Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuilds.data?.content.map((build: Build, rowIndex: number) => (
                <Tr key={rowIndex}>
                  {columns.includes(buildEntityAttributes.status.id) && (
                    <Td>
                      <BuildStatusIcon build={build} long />
                    </Td>
                  )}
                  {columns.includes(buildEntityAttributes.id.id) && (
                    <Td>
                      <Link to={`/builds/${build.id}`}>{`#${build.id}`}</Link>
                    </Td>
                  )}
                  {columns.includes(buildEntityAttributes.name.id) && (
                    <Td>
                      <BuildName build={build} includeBuildLink includeConfigLink long />
                    </Td>
                  )}
                  {columns.includes(buildEntityAttributes.submitTime.id) &&
                    columns.includes(buildEntityAttributes.startTime.id) &&
                    columns.includes(buildEntityAttributes.endTime.id) && (
                      <Td>
                        <DescriptionList className="gap-0" isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{buildEntityAttributes.submitTime.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {build.submitTime && createDateTime({ date: build.submitTime }).custom}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{buildEntityAttributes.startTime.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {build.startTime &&
                                createDateTime({
                                  date: build.startTime,
                                  includeDateInCustom: !build.submitTime || !areDatesEqual(build.submitTime, build.startTime),
                                }).custom}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>{buildEntityAttributes.endTime.title}</DescriptionListTerm>
                            <DescriptionListDescription>
                              {build.endTime &&
                                createDateTime({
                                  date: build.endTime,
                                  includeDateInCustom:
                                    (!!build.startTime && !areDatesEqual(build.startTime, build.endTime)) ||
                                    (!!build.submitTime && !areDatesEqual(build.submitTime, build.endTime)),
                                }).custom}
                              {build.startTime && build.endTime && ` (took ${calculateDuration(build.startTime, build.endTime)})`}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </Td>
                    )}
                  {columns.includes(buildEntityAttributes['user.username'].id) && (
                    <Td>{build.user?.username && <Username text={build.user.username} />}</Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuilds.data?.totalHits} />
    </>
  );
};
