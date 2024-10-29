import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigGroupConfigsPageProps {
  componentId?: string;
}

export const BuildConfigGroupConfigsPage = ({ componentId = 'bcg' }: IBuildConfigGroupConfigsPageProps) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerGroupConfigs = useServiceContainer(buildConfigApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerGroupConfigsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerGroupConfigsRunner, buildConfigId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Group Configs</Text>
            <Text>This list contains Group Configs where this Build Config is included in.</Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>

      <GroupConfigsList serviceContainerGroupConfigs={serviceContainerGroupConfigs} componentId={componentId} />
    </>
  );
};
