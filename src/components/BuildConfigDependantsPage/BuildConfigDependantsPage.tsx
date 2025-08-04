import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

interface IBuildConfigDependantsPageProps {
  componentId?: string;
}

export const BuildConfigDependantsPage = ({ componentId = 'bcd2' }: IBuildConfigDependantsPageProps) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerDependants = useServiceContainer(buildConfigApi.getDependants);
  const serviceContainerDependantsRunner = serviceContainerDependants.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerDependantsRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerDependantsRunner, buildConfigId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <PageSectionHeader
            title="Dependants"
            description={
              <>
                This list contains Build Configs that are using this Build Config as a dependency. Depending on build preferences
                this Build Config may be rebuilt when building dependent Build Configs.
              </>
            }
          />
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList serviceContainerBuildConfigs={serviceContainerDependants} componentId={componentId} />
    </>
  );
};
