import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionBuildConfigsPageProps {
  componentId?: string;
}

export const ProductVersionBuildConfigsPage = ({ componentId = 'b1' }: IProductVersionBuildConfigsPageProps) => {
  const { productVersionId } = useParams();

  const serviceContainerBuildConfigs = useServiceContainer(productVersionApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Build Configs</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop shadow={false}>
        <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />
      </ContentBox>
    </>
  );
};
