import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

export const BuildConfigDependantsPage = ({ componentId = 'bcd2' }) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerDependants = useServiceContainer(buildConfigApi.getDependants);
  const serviceContainerDependantsRunner = serviceContainerDependants.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerDependantsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Dependants</Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList serviceContainerBuildConfigs={serviceContainerDependants} componentId={componentId} />
    </>
  );
};
