import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionGroupConfigsPageProps {
  componentId?: string;
}

export const ProductVersionGroupConfigsPage = ({ componentId = 'g1' }: IProductVersionGroupConfigsPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerGroupConfigs = useServiceContainer(productVersionApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerGroupConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerGroupConfigsRunner, productVersionId]
    ),
    { componentId }
  );
  return (
    <>
      <Toolbar>
        <ToolbarItem reservedWidth>
          <PageSectionHeader title="Group Configs" />
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <GroupConfigsList {...{ serviceContainerGroupConfigs, componentId }} />
    </>
  );
};
