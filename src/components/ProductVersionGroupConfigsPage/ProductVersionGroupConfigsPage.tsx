import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionGroupConfigsPageProps {
  componentId?: string;
}

export const ProductVersionGroupConfigsPage = ({ componentId = 'g1' }: IProductVersionGroupConfigsPageProps) => {
  const { productVersionId } = useParams();

  const serviceContainerGroupConfigs = useServiceContainer(productVersionApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerGroupConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId }
  );
  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Group Configs</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop shadow={false}>
        <GroupConfigsList {...{ serviceContainerGroupConfigs, componentId }} />
      </ContentBox>
    </>
  );
};
