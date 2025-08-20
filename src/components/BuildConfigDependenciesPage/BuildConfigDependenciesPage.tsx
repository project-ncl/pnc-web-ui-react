import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProtectedActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
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
    useCallback(
      ({ requestConfig } = {}) => serviceContainerDependenciesRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerDependenciesRunner, buildConfigId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <PageSectionHeader
            title="Dependencies"
            description={
              <>
                This list contains Build Configs that are dependencies of this Build Config. Depending on the build preferences,
                Build Configs from this list may be rebuilt when building this Build Config.
              </>
            }
          />
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedActionButton variant="secondary" link="edit">
            Edit list
          </ProtectedActionButton>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList componentId={componentId} serviceContainerBuildConfigs={serviceContainerDependencies} />
    </>
  );
};
