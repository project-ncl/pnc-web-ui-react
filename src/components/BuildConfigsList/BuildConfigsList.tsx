import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo, useState } from 'react';

import { BuildConfigWithLatestPage } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { BuildStartButton } from 'components/BuildStartButton/BuildStartButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { BuildConfigBuildTypeLabelMapper } from 'components/LabelMapper/BuildConfigBuildTypeLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { Username } from 'components/Username/Username';

import { areDatesEqual, checkColumnsCombinations } from 'utils/utils';

type TColumns = Array<keyof typeof buildConfigEntityAttributes>;

interface IBuildConfigsListProps {
  serviceContainerBuildConfigs: IServiceContainerState<BuildConfigWithLatestPage>;
  columns?: TColumns;
  componentId: string;
}

const defaultColumns: TColumns = [
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
  const [isTimesSortDropdownOpen, setIsTimesSortDropdownOpen] = useState<boolean>(false);

  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: buildConfigEntityAttributes,
        defaultSorting: {
          attribute: buildConfigEntityAttributes.name.id,
          direction: 'asc',
        },
        customColumns: columns,
      }),
    [columns]
  );

  const { getSortParams, getSortGroupParams } = useSorting(sortOptions, componentId);

  checkColumnsCombinations({
    columns,
    combinations: [[buildConfigEntityAttributes.creationTime.id, buildConfigEntityAttributes.modificationTime.id]],
  });

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes: buildConfigEntityAttributes,
                  customColumns: columns,
                  defaultFiltering: { attribute: buildConfigEntityAttributes.name.id },
                }),
              [columns]
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuildConfigs} title={PageTitles.buildConfigs}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                {columns.includes(buildConfigEntityAttributes.name.id) && (
                  <Th width={25} sort={getSortParams(sortOptions.sortAttributes.name.id)}>
                    {buildConfigEntityAttributes.name.title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes.description.id) && (
                  <Th width={15}>{buildConfigEntityAttributes.description.title}</Th>
                )}
                {columns.includes(buildConfigEntityAttributes.buildType.id) && (
                  <Th width={10} sort={getSortParams(sortOptions.sortAttributes.buildType.id)}>
                    {buildConfigEntityAttributes.buildType.title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes['project.name'].id) && (
                  <Th width={15} sort={getSortParams(sortOptions.sortAttributes['project.name'].id)}>
                    {buildConfigEntityAttributes['project.name'].title}
                  </Th>
                )}
                {columns.includes(buildConfigEntityAttributes.creationTime.id) &&
                  columns.includes(buildConfigEntityAttributes.modificationTime.id) && (
                    <Th width={25} className="overflow-visible">
                      <SortGroup
                        title="Times"
                        sort={getSortGroupParams(sortOptions.sortAttributes.creationTime.id)}
                        isDropdownOpen={isTimesSortDropdownOpen}
                        onDropdownToggle={() => setIsTimesSortDropdownOpen(!isTimesSortDropdownOpen)}
                      />
                    </Th>
                  )}
                {columns.includes(buildConfigEntityAttributes.actions.id) && (
                  <ProtectedComponent>
                    <Th width={15}>{buildConfigEntityAttributes.actions.title}</Th>
                  </ProtectedComponent>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuildConfigs.data?.content?.map((buildConfig, rowIndex) => (
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
                              {buildConfig.creationTime && <DateTime date={buildConfig.creationTime} />}
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
                              {buildConfig.modificationTime && (
                                <DateTime
                                  date={buildConfig.modificationTime}
                                  displayDate={
                                    !buildConfig.creationTime ||
                                    !areDatesEqual(buildConfig.modificationTime, buildConfig.creationTime)
                                  }
                                />
                              )}
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
                      <ProtectedComponent>
                        <BuildStartButton buildConfig={buildConfig} isCompact />
                      </ProtectedComponent>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuildConfigs.data?.totalHits} />
    </>
  );
};
