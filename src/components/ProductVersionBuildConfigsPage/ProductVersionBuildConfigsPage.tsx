import { useParams } from 'react-router-dom';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';

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

  return <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />;
};
