import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Build } from 'pnc-api-types-ts';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { BuildName } from 'components/BuildName/BuildName';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IDefaultFiltering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { areDatesEqual, calculateDuration, createDateTime } from 'utils/utils';

const defaultFiltering: IDefaultFiltering = {
  attribute: buildEntityAttributes.status.id,
};

const sortAttributes: ISortAttributes = {
  status: {
    id: 'status',
    title: 'Status',
    tableColumnIndex: 0,
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submitted',
    tableColumnIndex: 3,
    sortGroup: 'times',
  },
  startTime: {
    id: 'startTime',
    title: 'Started',
    tableColumnIndex: 4,
    sortGroup: 'times',
  },
  endTime: {
    id: 'endTime',
    title: 'Ended',
    tableColumnIndex: 5,
    sortGroup: 'times',
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    tableColumnIndex: 6,
  },
};

const defaultSorting: IDefaultSorting = {
  attribute: sortAttributes.submitTime.id,
  direction: 'desc',
};

interface IBuildsListProps {
  serviceContainerBuilds: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Builds.
 *
 * @param serviceContainerBuilds - Service Container for Builds
 * @param componentId - Component ID
 */
export const BuildsList = ({ serviceContainerBuilds, componentId }: IBuildsListProps) => {
  const { getSortParams, getSortGroupParams } = useSorting(sortAttributes, componentId, defaultSorting);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={getFilterAttributes(buildEntityAttributes)}
            componentId={componentId}
            defaultFiltering={defaultFiltering}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.builds}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={20} sort={getSortParams(sortAttributes['status'].id)}>
                  {buildEntityAttributes.status.title}
                </Th>
                <Th width={15}>{buildEntityAttributes.id.title}</Th>
                <Th width={35}>{buildEntityAttributes.name.title}</Th>
                <Th width={20} className="overflow-visible">
                  <SortGroup
                    title="Times"
                    sort={getSortGroupParams(sortAttributes['submitTime'].id!)}
                    isDropdownOpen={isSortDropdownOpen}
                    onDropdownToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  />
                </Th>
                <Th width={10} sort={getSortParams(sortAttributes['user.username'].id)}>
                  {buildEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuilds.data?.content.map((build: Build, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>
                    <BuildStatusIcon build={build} long />
                  </Td>
                  <Td>
                    <Link to={`/builds/${build.id}`}>{`#${build.id}`}</Link>
                  </Td>
                  <Td>
                    <BuildName build={build} includeBuildLink includeConfigLink long />
                  </Td>
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
                  <Td>{build.user?.username}</Td>
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
