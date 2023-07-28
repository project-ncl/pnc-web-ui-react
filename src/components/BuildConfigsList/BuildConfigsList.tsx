import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useState } from 'react';

import { BuildConfigurationWithLatestBuild } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { IDefaultSorting, ISortAttributes, useSorting } from 'hooks/useSorting';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { BuildStartButton } from 'components/BuildStartButton/BuildStartButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering, IDefaultFiltering } from 'components/Filtering/Filtering';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { PROTECTED_TYPE, ProtectedContent } from 'components/ProtectedContent/ProtectedContent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { Username } from 'components/Username/Username';

import { areDatesEqual, checkColumnsCombinations, createDateTime } from 'utils/utils';

const defaultFiltering: IDefaultFiltering = {
  attribute: buildConfigEntityAttributes.name.id,
};

const sortAttributes: ISortAttributes = {
  name: {
    id: 'name',
    title: 'Name',
    tableColumnIndex: 0,
  },
  buildType: {
    id: 'buildType',
    title: 'Build Type',
    tableColumnIndex: 2,
  },
  'project.name': {
    id: 'project.name',
    title: 'Project',
    tableColumnIndex: 3,
  },
  creationTime: {
    id: 'creationTime',
    title: 'Created',
    tableColumnIndex: 4,
    sortGroup: 'times',
  },
  modificationTime: {
    id: 'modificationTime',
    title: 'Modified',
    tableColumnIndex: 5,
    sortGroup: 'times',
  },
};

const defaultSorting: IDefaultSorting = {
  attribute: sortAttributes.name.id,
  direction: 'asc',
};

interface IBuildConfigsListProps {
  serviceContainerBuildConfigs: IServiceContainer;
  columns?: Array<keyof typeof buildConfigEntityAttributes>;
  componentId: string;
}

const defaultColumns = [
  buildConfigEntityAttributes.name.id,
  buildConfigEntityAttributes.buildType.id,
  buildConfigEntityAttributes['project.name'].id,
  buildConfigEntityAttributes.creationTime.id,
  buildConfigEntityAttributes.modificationTime.id,
  buildConfigEntityAttributes.buildStatus.id,
];

/**
 * Component displaying list of BuildConfigs.
 *
 * @param serviceContainerBuildConfigs - Service Container for BuildConfigs
 * @param columns - The columns to be displayed
 * @param componentId - Component ID
 */
export const BuildConfigsList = ({
  serviceContainerBuildConfigs,
  columns = defaultColumns,
  componentId,
}: IBuildConfigsListProps) => {
  const { getSortParams, getSortGroupParams } = useSorting(sortAttributes, componentId, defaultSorting);

  const [isTimesSortDropdownOpen, setIsTimesSortDropdownOpen] = useState<boolean>(false);

  checkColumnsCombinations({
    columns,
    combinations: [[buildConfigEntityAttributes.creationTime.id, buildConfigEntityAttributes.modificationTime.id]],
  });

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={getFilterAttributes(buildConfigEntityAttributes, defaultColumns)}
            componentId={componentId}
            defaultFiltering={defaultFiltering}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuildConfigs} title={PageTitles.buildConfigs}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                {columns.includes(buildConfigEntityAttributes.name.id) && (
                  <Th width={25} sort={getSortParams(sortAttributes.name.id)}>
                    {buildConfigEntityAttributes.name.title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes.description.id) && (
                  <Th width={15}>{buildConfigEntityAttributes.description.title}</Th>
                )}
                {columns.includes(buildConfigEntityAttributes.buildType.id) && (
                  <Th width={10} sort={getSortParams(sortAttributes.buildType.id)}>
                    {buildConfigEntityAttributes.buildType.title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes['project.name'].id) && (
                  <Th width={15} sort={getSortParams(sortAttributes['project.name'].id)}>
                    {buildConfigEntityAttributes['project.name'].title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes.creationTime.id) &&
                  columns.includes(buildConfigEntityAttributes.modificationTime.id) && (
                    <Th width={25} className="overflow-visible">
                      <SortGroup
                        title="Times"
                        sort={getSortGroupParams(sortAttributes.creationTime.id)}
                        isDropdownOpen={isTimesSortDropdownOpen}
                        onDropdownToggle={() => setIsTimesSortDropdownOpen(!isTimesSortDropdownOpen)}
                      />
                    </Th>
                  )}
                {columns.includes(buildConfigEntityAttributes.actions.id) && (
                  <ProtectedContent type={PROTECTED_TYPE.Component}>
                    <Th width={15}>{buildConfigEntityAttributes.actions.title}</Th>
                  </ProtectedContent>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuildConfigs.data?.content.map(
                (buildConfig: BuildConfigurationWithLatestBuild, rowIndex: number) => (
                  <Tr key={rowIndex}>
                    {columns.includes(buildConfigEntityAttributes.name.id) && (
                      <Td>
                        <BuildConfigLink id={buildConfig.id}>{buildConfig.name}</BuildConfigLink>
                      </Td>
                    )}
                    {columns.includes(buildConfigEntityAttributes.description.id) && <Td>{buildConfig.description}</Td>}
                    {columns.includes(buildConfigEntityAttributes.buildType.id) && (
                      <Td>
                        <BuildConfigBuildTypeLabelMapper buildType={buildConfig.buildType} />
                      </Td>
                    )}
                    {columns.includes(buildConfigEntityAttributes['project.name'].id) && (
                      <Td>
                        {buildConfig.project && <ProjectLink id={buildConfig.project.id}>{buildConfig.project.name}</ProjectLink>}
                      </Td>
                    )}
                    {columns.includes(buildConfigEntityAttributes.creationTime.id) &&
                      columns.includes(buildConfigEntityAttributes.modificationTime.id) && (
                        <Td>
                          <DescriptionList className="gap-0" isHorizontal isCompact>
                            <DescriptionListGroup>
                              <DescriptionListTerm>{buildConfigEntityAttributes.creationTime.title}</DescriptionListTerm>
                              <DescriptionListDescription>
                                {buildConfig.creationTime && createDateTime({ date: buildConfig.creationTime }).custom}
                                {buildConfig.creationUser?.username && (
                                  <span>
                                    {' '}
                                    by{' '}
                                    <b>
                                      <Username text={buildConfig.creationUser.username} />
                                    </b>
                                  </span>
                                )}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>{buildConfigEntityAttributes.modificationTime.title}</DescriptionListTerm>
                              <DescriptionListDescription>
                                {buildConfig.modificationTime &&
                                  createDateTime({
                                    date: buildConfig.modificationTime,
                                    includeDateInCustom:
                                      !buildConfig.creationTime ||
                                      !areDatesEqual(buildConfig.modificationTime, buildConfig.creationTime),
                                  }).custom}
                                {buildConfig.modificationUser?.username && (
                                  <span>
                                    {' '}
                                    by{' '}
                                    <b>
                                      <Username text={buildConfig.modificationUser.username} />
                                    </b>
                                  </span>
                                )}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </Td>
                      )}
                    {columns.includes(buildConfigEntityAttributes.actions.id) && (
                      <Td>
                        <ProtectedContent type={PROTECTED_TYPE.Component}>
                          <BuildStartButton buildConfig={buildConfig} size="sm" />
                        </ProtectedContent>
                      </Td>
                    )}
                  </Tr>
                )
              )}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuildConfigs.data?.totalHits} />
    </>
  );
};
