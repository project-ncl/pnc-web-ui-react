import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
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
          <Content>
            <Content component={ContentVariants.h2}>Dependants</Content>
            <Content component={ContentVariants.p}>
              This list contains Build Configs that are using this Build Config as a dependency. Depending on build preferences
              this Build Config may be rebuilt when building dependent Build Configs.
            </Content>
          </Content>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList serviceContainerBuildConfigs={serviceContainerDependants} componentId={componentId} />
    </>
  );
};
