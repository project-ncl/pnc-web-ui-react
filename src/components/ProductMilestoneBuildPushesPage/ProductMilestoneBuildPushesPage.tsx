import { Switch, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasBuildPushFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { StorageKeys, useStorage } from 'hooks/useStorage';

import { BuildPushesList } from 'components/BuildPushesList/BuildPushesList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneBuildPushesPageProps {
  componentId?: string;
}

export const ProductMilestoneBuildPushesPage = ({ componentId = 'bp1' }: IProductMilestoneBuildPushesPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const { componentQueryParamsObject: buildPushesQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerBuildPushes = useServiceContainer(productMilestoneApi.getBuildPushes);
  const serviceContainerBuildPushesRunner = serviceContainerBuildPushes.run;

  const { storageValue: areOnlyLatestBuildPushesShown, storeToStorage: setAreOnlyLatestBuildPushesShown } = useStorage<boolean>({
    storageKey: StorageKeys.areOnlyLatestBuildPushesShown,
    initialValue: true,
  });

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerBuildPushesRunner({
          serviceData: { id: productMilestoneId, latest: areOnlyLatestBuildPushesShown },
          requestConfig,
        }),
      [productMilestoneId, serviceContainerBuildPushesRunner, areOnlyLatestBuildPushesShown]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildPushFinished(wsData, { productMilestoneId })) {
          serviceContainerBuildPushesRunner({
            serviceData: { id: productMilestoneId, latest: areOnlyLatestBuildPushesShown },
            requestConfig: { params: buildPushesQueryParamsObject },
          });
        }
      },
      [productMilestoneId, serviceContainerBuildPushesRunner, buildPushesQueryParamsObject, areOnlyLatestBuildPushesShown]
    )
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component={TextVariants.h2}>Build Pushes</Text>
            <Text>
              This list contains Build Pushes for each Build in the Milestone. This includes Pushes done during Milestone close
              and Pushes done outside the close.
            </Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>
      <BuildPushesList
        {...{
          serviceContainerBuildPushes,
          componentId,
          customToolbarItems: (
            <TooltipWrapper tooltip="Show only the latest Build Pushes for each Build in the Milestone.">
              <Switch
                id={StorageKeys.areOnlyLatestBuildPushesShown}
                label="Latest Build Pushes"
                isChecked={areOnlyLatestBuildPushesShown}
                onChange={(_, checked) => {
                  setAreOnlyLatestBuildPushesShown(checked);
                }}
              />
            </TooltipWrapper>
          ),
        }}
      />
    </>
  );
};
