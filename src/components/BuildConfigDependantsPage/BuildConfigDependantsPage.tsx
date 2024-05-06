import { Text, TextContent, TextVariants } from '@patternfly/react-core';

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
        <Text>
          This list contains Build Configs that are using this Build Config as a dependency. Depending on build preferences this
          Build Config may be rebuilt when building dependent Build Configs.
        </Text>
      </Toolbar>

      <BuildConfigsList serviceContainerBuildConfigs={serviceContainerDependants} componentId={componentId} />
    </>
  );
};
