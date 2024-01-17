import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

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
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Dependencies</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton link="edit">Edit</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList componentId={componentId} serviceContainerBuildConfigs={serviceContainerDependencies} />
    </>
  );
};
