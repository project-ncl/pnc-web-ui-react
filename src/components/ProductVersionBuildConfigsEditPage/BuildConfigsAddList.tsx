import { Button } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { PageTitles } from 'common/constants';
import { getFilterOptions, getSortOptions } from 'common/entityAttributes';

import { useCheckbox } from 'hooks/useCheckbox';
import { IServiceContainer } from 'hooks/useServiceContainer';
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

interface IBuildConfigsAddListProps {
  serviceContainerBuildConfigs: IServiceContainer;
  componentId: string;
  onBuildConfigAdd: (buildConfig: BuildConfiguration) => void;
  addedBuildConfigs: BuildConfiguration[];
  productVersionToExclude: string;
}

/**
 * Component displaying list of Build Configs that can be added to the to-be-added list.
 *
 * @param serviceContainerBuildConfigs - Service Container for Build Configs
 * @param componentId - Component ID
 * @param onBuildConfigAdd - Callback to add a Build Config to the to-be-added list with
 * @param addedBuildConfigs - List of already added Build Configs
 * @param productVersionToExclude - ID of Product Version, Build Configs of which cannot be added
 */
export const BuildConfigsAddList = ({
  serviceContainerBuildConfigs,
  componentId,
  onBuildConfigAdd,
  addedBuildConfigs,
  productVersionToExclude,
}: IBuildConfigsAddListProps) => {
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

  const checkableBuildConfigs: BuildConfiguration[] = (serviceContainerBuildConfigs.data?.content || []).filter(
    (buildConfig: BuildConfiguration) =>
      addedBuildConfigs.every((addedBuildConfig) => addedBuildConfig.id !== buildConfig.id) &&
      buildConfig.productVersion?.id !== productVersionToExclude
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
                  defaultFiltering: { attribute: buildConfigEntityAttributes['project.name'].id },
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
              {serviceContainerBuildConfigs.data?.content.map((buildConfig: BuildConfiguration, rowIndex: number) => {
                const isAdded = addedBuildConfigs.some((addedBuildConfig) => addedBuildConfig.id === buildConfig.id);

                const disabledReason = isAdded
                  ? 'Already marked to be added.'
                  : buildConfig.productVersion?.id === productVersionToExclude
                  ? 'Already in the Version.'
                  : '';

                const warningReason =
                  buildConfig.productVersion &&
                  `Build Config is already assigned to different Version. Once added to this Version, it will be removed from the original one.`;

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
                      <TooltipWrapper tooltip={disabledReason || warningReason}>
                        <Button
                          variant={warningReason ? 'warning' : 'secondary'}
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
