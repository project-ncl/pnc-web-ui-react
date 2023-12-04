import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

export const BuildConfigGroupConfigsPage = ({ componentId = 'bcg' }) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerGroupConfigs = useServiceContainer(buildConfigApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerGroupConfigsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Group Configs</Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>

      <GroupConfigsList serviceContainerGroupConfigs={serviceContainerGroupConfigs} componentId={componentId} />
    </>
  );
};
