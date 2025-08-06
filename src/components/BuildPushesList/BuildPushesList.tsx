import { Switch } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { BuildPushOperationPage } from 'pnc-api-types-ts';

import { buildPushOperationEntityAttributes } from 'common/buildPushOperationEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';
import { StorageKeys, useStorage } from 'hooks/useStorage';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { OperationProgressStatusLabelMapper } from 'components/LabelMapper/OperationProgressStatusLabelMapper';
import { OperationResultLabelMapper } from 'components/LabelMapper/OperationResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { SortGroup } from 'components/SortGroup/SortGroup';
import { TimesList } from 'components/TimesList/TimesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarGroup } from 'components/Toolbar/ToolbarGroup';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';
import { Username } from 'components/Username/Username';

import { isArray } from 'utils/entityRecognition';

interface IBuildPushesListProps {
  serviceContainerBuildPushes: IServiceContainerState<BuildPushOperationPage>;
  componentId: string;
  customToolbarItems?: ReactNode | ReactNode[];
}

/**
 * Component displaying list of Build Push operations.
 *
 * @param serviceContainerProjects - Service Container for Build Push operations
 * @param componentId - Component ID
 * @param customToolbarItems - custom toolbar components in the second row of the toolbar
 */
export const BuildPushesList = ({ serviceContainerBuildPushes, componentId, customToolbarItems }: IBuildPushesListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: buildPushOperationEntityAttributes,
        defaultSorting: {
          attribute: buildPushOperationEntityAttributes.endTime.id,
          direction: 'desc',
        },
      }),
    []
  );

  const { getSortParams, getSortGroupParams } = useSorting(sortOptions, componentId);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  const { storageValue: isCompactMode, storeToStorage: storeIsCompactMode } = useStorage<boolean>({
    storageKey: StorageKeys.isBuildsListCompactMode,
    initialValue: true,
  });

  return (
    <>
      <Toolbar column>
        <ToolbarGroup>
          <ToolbarItem>
            <Filtering
              filterOptions={useMemo(
                () =>
                  getFilterOptions({
                    entityAttributes: buildPushOperationEntityAttributes,
                    defaultFiltering: { attribute: buildPushOperationEntityAttributes.progressStatus.id },
                  }),
                []
              )}
              componentId={componentId}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <TooltipWrapper tooltip="Show Build Pushes in compact format, where certain details are hidden.">
              <Switch
                id={StorageKeys.isBuildsListCompactMode}
                label="Compact Mode"
                isChecked={isCompactMode}
                onChange={(_, checked) => {
                  storeIsCompactMode(checked);
                }}
              />
            </TooltipWrapper>
          </ToolbarItem>
          {isArray(customToolbarItems) ? (
            customToolbarItems.map((customToolbarItem) => <ToolbarItem>{customToolbarItem}</ToolbarItem>)
          ) : (
            <ToolbarItem>{customToolbarItems}</ToolbarItem>
          )}
        </ToolbarGroup>
      </Toolbar>

      <ContentBox>
        <ServiceContainerLoading {...serviceContainerBuildPushes} title={PageTitles.buildPushes}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{buildPushOperationEntityAttributes.id.title}</Th>
                <Th width={15}>{buildPushOperationEntityAttributes.progressStatus.title}</Th>
                <Th width={15}>{buildPushOperationEntityAttributes.result.title}</Th>
                <Th width={25} className="overflow-visible">
                  <SortGroup
                    title="Times"
                    sort={getSortGroupParams(sortOptions.sortAttributes['submitTime'].id!)}
                    isDropdownOpen={isSortDropdownOpen}
                    onDropdownToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  />
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                  {buildPushOperationEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuildPushes.data?.content?.map((buildPush, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    <Link to={`/builds/${buildPush.build?.id}/build-pushes/${buildPush.id}`}>{buildPush.id}</Link>
                  </Td>
                  <Td>
                    {buildPush.progressStatus && <OperationProgressStatusLabelMapper progressStatus={buildPush.progressStatus} />}
                  </Td>
                  <Td>{buildPush.result && <OperationResultLabelMapper result={buildPush.result} />}</Td>
                  <Td>
                    <TimesList
                      {...buildPush}
                      entityAttributes={buildPushOperationEntityAttributes}
                      isCompactMode={isCompactMode}
                    />
                  </Td>
                  <Td>{buildPush.user?.username && <Username text={buildPush.user.username} />}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuildPushes.data?.totalHits} />
    </>
  );
};
