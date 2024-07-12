import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionBuildConfigsPageProps {
  componentId?: string;
}

export const ProductVersionBuildConfigsPage = ({ componentId = 'b1' }: IProductVersionBuildConfigsPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerBuildConfigs = useServiceContainer(productVersionApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem reservedWidth>
          <TextContent>
            <Text component={TextVariants.h2}>Build Configs</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />
    </>
  );
};
