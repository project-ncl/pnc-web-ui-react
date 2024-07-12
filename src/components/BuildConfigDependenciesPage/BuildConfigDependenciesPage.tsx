import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigDependenciesPageProps {
  componentId?: string;
}

export const BuildConfigDependenciesPage = ({ componentId = 'bcd1' }: IBuildConfigDependenciesPageProps) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerDependencies = useServiceContainer(buildConfigApi.getDependencies);
  const serviceContainerDependenciesRunner = serviceContainerDependencies.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerDependenciesRunner({ serviceData: { id: buildConfigId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component={TextVariants.h2}>Dependencies</Text>
            <Text>
              This list contains Build Configs that are dependencies of this Build Config. Depending on the build preferences,
              Build Configs from this list may be rebuilt when building this Build Config.
            </Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList componentId={componentId} serviceContainerBuildConfigs={serviceContainerDependencies} />
    </>
  );
};
