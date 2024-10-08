import { Button } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';
import { ConfigPage } from 'common/types';

import { useCheckbox } from 'hooks/useCheckbox';
import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { BuildConfigLink } from 'components/BuildConfigLink/BuildConfigLink';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isBuildConfig, isGroupConfig } from 'utils/entityRecognition';

interface IConfigsAddListProps<T extends BuildConfiguration | GroupConfiguration> {
  variant: 'Build' | 'Group Build';
  serviceContainerConfigs: IServiceContainerState<ConfigPage<T>>;
  componentId: string;
  onConfigAdd: (config: T) => void;
  addedConfigs: T[];
  productVersionToExclude?: string;
  buildConfigToExclude?: string;
  groupConfigToExclude?: string;
  dependenciesToExclude?: string[];
}

/**
 * Component displaying list of Build/Group Configs that can be added to the to-be-added list.
 *
 * @param variant - Build or Group Build variant
 * @param serviceContainerConfigs - Service Container for Build/Group Configs
 * @param componentId - Component ID
 * @param onConfigAdd - Callback to add a Build/Group Config to the to-be-added list with
 * @param addedConfigs - List of already added Build/Group Configs
 * @param productVersionToExclude - ID of Product Version, Build/Group Configs of which cannot be added
 * @param buildConfigToExclude - ID of Build Config, Build Configs of which cannot be added
 * @param groupConfigToExclude - ID of Group Config, Build Configs of which cannot be added
 * @param dependenciesToExclude - IDs of Build Configs which cannot be added as dependencies
 */
export const ConfigsAddList = <T extends BuildConfiguration | GroupConfiguration>({
  variant,
  serviceContainerConfigs,
  componentId,
  onConfigAdd,
  addedConfigs,
  productVersionToExclude,
  buildConfigToExclude,
  groupConfigToExclude,
  dependenciesToExclude,
}: IConfigsAddListProps<T>) => {
  const isBuildVariant = useMemo(() => variant === 'Build', [variant]);
  const entityAttributes = useMemo(
    () => (isBuildVariant ? buildConfigEntityAttributes : groupConfigEntityAttributes),
    [isBuildVariant]
  );

  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes,
        defaultSorting: isBuildVariant
          ? {
              attribute: buildConfigEntityAttributes.modificationTime.id,
              direction: 'desc',
            }
          : {
              attribute: entityAttributes.name.id,
              direction: 'asc',
            },
      }),
    [isBuildVariant, entityAttributes]
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  const getConfigDisabledReason = (config: T) =>
    addedConfigs.some((addedConfig) => addedConfig.id === config.id)
      ? 'Already marked to be added.'
      : !!productVersionToExclude && config.productVersion?.id === productVersionToExclude
      ? 'Already in the Version.'
      : !!productVersionToExclude && isGroupConfig(config) && config.productVersion
      ? 'Group Config is already assigned to different Version.'
      : !!buildConfigToExclude && isBuildConfig(config) && config.id === buildConfigToExclude
      ? 'Build Config cannot depend on itself.'
      : !!buildConfigToExclude &&
        isBuildConfig(config) &&
        config.dependencies &&
        Object.keys(config.dependencies).includes(buildConfigToExclude)
      ? 'Cannot add cyclic dependency.'
      : !!dependenciesToExclude && isBuildConfig(config) && dependenciesToExclude.includes(config.id)
      ? 'Already dependent on the Build Config.'
      : !!groupConfigToExclude && isBuildConfig(config) && config.groupConfigs?.[groupConfigToExclude]
      ? 'Already in the Group Config.'
      : '';

  const checkableConfigs: T[] = (serviceContainerConfigs.data?.content || []).filter(
    (config: T) => !getConfigDisabledReason(config)
  );

  const {
    checkedItems,
    isItemChecked,
    toggleItemCheck,
    toggleItemCheckWithBulk,
    areAllItemsChecked,
    checkAllItems,
    uncheckAllItems,
  } = useCheckbox<T>({ items: checkableConfigs });

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes,
                  defaultFiltering: {
                    attribute: isBuildVariant ? buildConfigEntityAttributes['project.name'].id : entityAttributes.name.id,
                  },
                }),
              [entityAttributes, isBuildVariant]
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      {!!serviceContainerConfigs.data?.content?.length && (
        <Toolbar disablePaddingTop>
          <ToolbarItem>
            <Button
              variant="tertiary"
              onClick={() => {
                checkedItems.forEach((checkedItem) => {
                  onConfigAdd(checkedItem);
                  toggleItemCheck(checkedItem, false);
                });
              }}
              isDisabled={!checkedItems.length}
            >
              Add selected
            </Button>
          </ToolbarItem>
          {!!checkedItems.length && (
            <ToolbarItem>
              <b>{checkedItems.length}</b> to be added
            </ToolbarItem>
          )}
        </Toolbar>
      )}

      <ContentBox borderTop>
        <ServiceContainerLoading
          {...serviceContainerConfigs}
          title={isBuildVariant ? PageTitles.buildConfigs : PageTitles.groupConfigs}
        >
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_, isSelecting) => (isSelecting ? checkAllItems() : uncheckAllItems()),
                    isSelected: areAllItemsChecked,
                  }}
                  aria-label="Select all"
                />
                <Th width={40} sort={getSortParams(sortOptions.sortAttributes.name.id)}>
                  {entityAttributes.name.title}
                </Th>
                {isBuildVariant && (
                  <Th width={30} sort={getSortParams(sortOptions.sortAttributes['project.name'].id)}>
                    {buildConfigEntityAttributes['project.name'].title}
                  </Th>
                )}
                <Th aria-label="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerConfigs.data?.content?.map((config, rowIndex) => {
                const disabledReason = getConfigDisabledReason(config);
                const warningReason =
                  productVersionToExclude && isBuildConfig(config) && config.productVersion
                    ? 'Build Config is already assigned to different Version. Once added to this Version, it will be removed from the original one.'
                    : '';

                return (
                  <Tr key={rowIndex}>
                    <Td
                      select={{
                        rowIndex,
                        onSelect: (_, isSelecting) => toggleItemCheckWithBulk(config, isSelecting),
                        isSelected: isItemChecked(config),
                        isDisabled: !!disabledReason,
                      }}
                    />
                    <Td>
                      <BuildConfigLink id={config.id}>{config.name}</BuildConfigLink>
                    </Td>
                    {isBuildConfig(config) && (
                      <Td>{config.project && <ProjectLink id={config.project.id}>{config.project.name}</ProjectLink>}</Td>
                    )}
                    <Td isActionCell>
                      <TooltipWrapper tooltip={disabledReason || warningReason}>
                        <Button
                          variant={warningReason ? 'warning' : 'secondary'}
                          onClick={() => {
                            onConfigAdd(config);
                            toggleItemCheck(config, false);
                          }}
                          isAriaDisabled={!!disabledReason}
                          size="sm"
                        >
                          Add
                        </Button>
                      </TooltipWrapper>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerConfigs.data?.totalHits} pageSizeDefault="page10" />
    </>
  );
};
