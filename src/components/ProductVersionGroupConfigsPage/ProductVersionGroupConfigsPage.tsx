import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';

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

  return <GroupConfigsList {...{ serviceContainerGroupConfigs, componentId }} />;
};
