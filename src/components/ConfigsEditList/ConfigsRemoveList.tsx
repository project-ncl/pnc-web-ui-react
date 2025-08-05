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

import { isBuildConfig } from 'utils/entityRecognition';

interface IConfigsRemoveListProps<T extends BuildConfiguration | GroupConfiguration> {
  variant: 'Build' | 'Group Build';
  serviceContainerConfigs: IServiceContainerState<ConfigPage<T>>;
  componentId: string;
  onConfigRemove: (config: T) => void;
  removedConfigs: T[];
}

/**
 * Component displaying list of Build/Group Configs that can be added to the to-be-removed list.
 *
 * @param variant - Build or Group Config variant
 * @param serviceContainerConfigs - Service Container for Build/Group Configs
 * @param componentId - Component ID
 * @param onConfigRemove - Callback to add a Build/Group Config to the to-be-removed list with
 * @param removedConfigs - List of already removed Build/Group Configs
 */
export const ConfigsRemoveList = <T extends BuildConfiguration | GroupConfiguration>({
  variant,
  serviceContainerConfigs,
  componentId,
  onConfigRemove,
  removedConfigs,
}: IConfigsRemoveListProps<T>) => {
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

  const checkableConfigs: T[] = (serviceContainerConfigs.data?.content || []).filter((config: T) =>
    removedConfigs.every((removedConfig) => removedConfig.id !== config.id)
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
                  entityAttributes: entityAttributes,
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
        <Toolbar>
          <ToolbarItem>
            <Button
              variant="tertiary"
              onClick={() => {
                checkedItems.forEach((checkedItem) => {
                  onConfigRemove(checkedItem);
                  toggleItemCheck(checkedItem, false);
                });
              }}
              isDisabled={!checkedItems.length}
            >
              Remove selected
            </Button>
          </ToolbarItem>
          {!!checkedItems.length && (
            <ToolbarItem>
              <b>{checkedItems.length}</b> to be removed
            </ToolbarItem>
          )}
        </Toolbar>
      )}

      <ContentBox>
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
                const isRemoved = removedConfigs.some((removedConfig) => removedConfig.id === config.id);
                const disabledReason = isRemoved ? 'Already marked to be removed.' : '';

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
                      <TooltipWrapper tooltip={disabledReason}>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            onConfigRemove(config);
                            toggleItemCheck(config, false);
                          }}
                          isAriaDisabled={!!disabledReason}
                          size="sm"
                        >
                          Remove
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
