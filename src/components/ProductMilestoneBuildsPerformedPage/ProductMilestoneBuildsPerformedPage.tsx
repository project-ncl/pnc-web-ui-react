import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { BuildsList } from 'components/BuildsList/BuildsList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneBuildsPerformedPageProps {
  componentId?: string;
}

export const ProductMilestoneBuildsPerformedPage = ({ componentId = 'b1' }: IProductMilestoneBuildsPerformedPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerBuilds = useServiceContainer(productMilestoneApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerBuildsRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    { componentId }
  );

  return <BuildsList {...{ serviceContainerBuilds, componentId }} />;
};
