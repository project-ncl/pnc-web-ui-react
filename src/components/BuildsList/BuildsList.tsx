import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuItemGroup,
  OptionsMenuSeparator,
  OptionsMenuToggle,
} from '@patternfly/react-core';
import { SortAmountDownIcon } from '@patternfly/react-icons';
import { TableComposable, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useState } from 'react';

import { Build } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildName } from 'components/BuildName/BuildName';
import { BuildStatusIcon } from 'components/BuildStatusIcon/BuildStatusIcon';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import { areDatesEqual, calculateDuration, createDateTime } from 'utils/utils';

const filterOptions: IFilterOptions = {
  filterAttributes: {
    buildConfigName: {
      id: 'buildConfigName',
      title: 'Build Config Name',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
      isCustomParam: true,
    },
    status: {
      id: 'status',
      title: 'Status',
      filterValues: [
        'SUCCESS',
        'FAILED',
        'NO_REBUILD_REQUIRED',
        'ENQUEUED',
        'WAITING_FOR_DEPENDENCIES',
        'BUILDING',
        'REJECTED',
        'REJECTED_FAILED_DEPENDENCIES',
        'CANCELLED',
        'SYSTEM_ERROR',
        'NEW',
      ],
      operator: '==',
    },
    temporaryBuild: {
      id: 'temporaryBuild',
      title: 'Temporary Build',
      filterValues: ['TRUE', 'FALSE'],
      operator: '==',
    },
    'user.username': {
      id: 'user.username',
      title: 'User',
      placeholder: 'string | !string | s?ring | st*ng',
      operator: '=like=',
    },
  },
};

const sortOptions: ISortOptions = {
  status: {
    id: 'status',
    title: 'Status',
    tableColumnIndex: 0,
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submitted',
    tableColumnIndex: 3,
    isDefault: true,
    defaultSortOrder: 'desc',
  },
  startTime: {
    id: 'startTime',
    title: 'Started',
    tableColumnIndex: 4,
  },
  endTime: {
    id: 'endTime',
    title: 'Ended',
    tableColumnIndex: 5,
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    tableColumnIndex: 6,
  },
};

const timesSortIconStyle = { padding: '0', marginLeft: '1rem' };

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
  const { getSortParams, sort, activeSortIndex, activeSortAttribute, activeSortDirection } = useSorting(sortOptions, componentId);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const timesSortIcon = (
    <OptionsMenu
      id="times-sort-options"
      menuItems={[
        <OptionsMenuItemGroup>
          <OptionsMenuItem
            isSelected={activeSortIndex === 3}
            onSelect={() => {
              sort('submitTime', activeSortDirection!);
            }}
          >
            Submitted
          </OptionsMenuItem>
          <OptionsMenuItem
            isSelected={activeSortIndex === 4}
            onSelect={() => {
              sort('startTime', activeSortDirection!);
            }}
          >
            Started
          </OptionsMenuItem>
          <OptionsMenuItem
            isSelected={activeSortIndex === 5}
            onSelect={() => {
              sort('endTime', activeSortDirection!);
            }}
          >
            Ended
          </OptionsMenuItem>
        </OptionsMenuItemGroup>,
        <OptionsMenuSeparator />,
        <OptionsMenuItemGroup>
          <OptionsMenuItem
            onSelect={() => sort(activeSortAttribute!, 'asc')}
            isSelected={activeSortDirection === 'asc'}
            id="ascending"
          >
            Ascending
          </OptionsMenuItem>
          <OptionsMenuItem
            onSelect={() => sort(activeSortAttribute!, 'desc')}
            isSelected={activeSortDirection === 'desc'}
            id="descending"
          >
            Descending
          </OptionsMenuItem>
        </OptionsMenuItemGroup>,
      ]}
      isOpen={isSortDropdownOpen}
      toggle={
        <OptionsMenuToggle
          style={timesSortIconStyle}
          hideCaret
          onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          toggleTemplate={<SortAmountDownIcon />}
        />
      }
      isPlain
      isGrouped
      removeFindDomNode
    />
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={filterOptions} componentId={componentId} />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuilds} title={PageTitles.builds}>
          <TableComposable isExpandable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortOptions) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={20} sort={getSortParams(sortOptions['status'].id)}>
                  Status
                </Th>
                <Th width={15}>Job Id</Th>
                <Th width={35}>Name</Th>
                <Th width={20} className="overflow-visible">
                  Times {timesSortIcon}
                </Th>
                <Th width={10} sort={getSortParams(sortOptions['user.username'].id)}>
                  User
                </Th>
              </Tr>
            </Thead>
            {serviceContainerBuilds.data?.content.map((build: Build, rowIndex: number) => (
              <Tr key={rowIndex}>
                <Td>
                  <BuildStatusIcon build={build} long />
                </Td>
                <Td>{`#${build.id}`}</Td>
                <Td>
                  <BuildName build={build} long />
                </Td>
                <Td>
                  <DescriptionList isHorizontal isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Submitted</DescriptionListTerm>
                      <DescriptionListDescription>
                        {build.submitTime && createDateTime({ date: build.submitTime })}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Started</DescriptionListTerm>
                      <DescriptionListDescription>
                        {build.startTime &&
                          createDateTime({
                            date: build.startTime,
                            includeDate: !build.submitTime || !areDatesEqual(build.submitTime, build.startTime),
                          })}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Ended</DescriptionListTerm>
                      <DescriptionListDescription>
                        {build.endTime &&
                          createDateTime({
                            date: build.endTime,
                            includeDate: !build.startTime || !areDatesEqual(build.startTime, build.endTime),
                          })}{' '}
                        {build.startTime && build.endTime && `(took ${calculateDuration(build.startTime, build.endTime)})`}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </Td>
                <Td>{build.user?.username}</Td>
              </Tr>
            ))}
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuilds.data?.totalHits} />
    </>
  );
};
