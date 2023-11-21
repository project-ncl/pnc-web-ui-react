import { Button } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { BuildConfigPage, BuildConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

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

interface IBuildConfigsAddDependenciesListProps {
  serviceContainerBuildConfigs: IServiceContainerState<BuildConfigPage>;
  componentId: string;
  onBuildConfigAdd: (buildConfig: BuildConfiguration) => void;
  addedBuildConfigs: BuildConfiguration[];
}

/**
 * Component displaying list of Build Configs that can be added as dependencies.
 *
 * @param serviceContainerConfigs - Service Container for Build Configs
 * @param componentId - Component ID
 * @param onConfigAdd - Callback to add a Build Config as a dependency
 * @param addedConfigs - List of already added Build Configs
 */
export const BuildConfigsAddDependenciesList = ({
  serviceContainerBuildConfigs,
  componentId,
  onBuildConfigAdd,
  addedBuildConfigs,
}: IBuildConfigsAddDependenciesListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: buildConfigEntityAttributes,
        defaultSorting: {
          attribute: buildConfigEntityAttributes.name.id,
          direction: 'asc',
        },
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  const checkableBuildConfigs = (serviceContainerBuildConfigs.data?.content || []).filter((buildConfig) =>
    addedBuildConfigs.every((addedBuildConfig) => addedBuildConfig.id !== buildConfig.id)
  );

  const {
    checkedItems,
    isItemChecked,
    toggleItemCheck,
    toggleItemCheckWithBulk,
    areAllItemsChecked,
    checkAllItems,
    uncheckAllItems,
  } = useCheckbox<BuildConfiguration>({ items: checkableBuildConfigs });

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () =>
                getFilterOptions({
                  entityAttributes: buildConfigEntityAttributes,
                  defaultFiltering: {
                    attribute: buildConfigEntityAttributes['project.name'].id,
                  },
                }),
              []
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      {!!serviceContainerBuildConfigs.data?.content?.length && (
        <Toolbar disablePaddingTop>
          <ToolbarItem>
            <Button
              variant="tertiary"
              onClick={() => {
                checkedItems.forEach((checkedItem) => {
                  onBuildConfigAdd(checkedItem);
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
        <ServiceContainerLoading {...serviceContainerBuildConfigs} title={PageTitles.buildConfigs}>
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_, isSelecting) => (isSelecting ? checkAllItems() : uncheckAllItems()),
                    isSelected: areAllItemsChecked,
                  }}
                />
                <Th width={40} sort={getSortParams(sortOptions.sortAttributes.name.id)}>
                  {buildConfigEntityAttributes.name.title}
                </Th>
                <Th width={30} sort={getSortParams(sortOptions.sortAttributes['project.name'].id)}>
                  {buildConfigEntityAttributes['project.name'].title}
                </Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerBuildConfigs.data?.content?.map((buildConfig, rowIndex) => {
                const isAdded = addedBuildConfigs.some((addedBuildConfig) => addedBuildConfig.id === buildConfig.id);
                const disabledReason = isAdded ? 'Already marked to be added.' : '';

                return (
                  <Tr key={rowIndex}>
                    <Td
                      select={{
                        rowIndex,
                        onSelect: (_, isSelecting) => toggleItemCheckWithBulk(buildConfig, isSelecting),
                        isSelected: isItemChecked(buildConfig),
                        disable: !!disabledReason,
                      }}
                    />
                    <Td>
                      <BuildConfigLink id={buildConfig.id}>{buildConfig.name}</BuildConfigLink>
                    </Td>
                    <Td>
                      {buildConfig.project && <ProjectLink id={buildConfig.project.id}>{buildConfig.project.name}</ProjectLink>}
                    </Td>
                    <Td isActionCell>
                      <TooltipWrapper tooltip={disabledReason}>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            onBuildConfigAdd(buildConfig);
                            toggleItemCheck(buildConfig, false);
                          }}
                          isAriaDisabled={!!disabledReason}
                          isSmall
                        >
                          Add
                        </Button>
                      </TooltipWrapper>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerBuildConfigs.data?.totalHits} />
    </>
  );
};
