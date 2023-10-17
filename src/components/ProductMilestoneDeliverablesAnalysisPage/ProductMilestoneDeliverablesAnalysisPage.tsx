import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProductMilestoneDeliverablesAnalysisList } from 'components/ProductMilestoneDeliverablesAnalysisList/ProductMilestoneDeliverablesAnalysisList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneDeliverablesAnalysisPage {
  componentId?: string;
}

export const ProductMilestoneDeliverablesAnalysisPage = ({ componentId = 'c1' }: IProductMilestoneDeliverablesAnalysisPage) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerDeliverablesAnalysis = useServiceContainer(productMilestoneApi.getDeliverablesAnalysis);
  const serviceContainerDeliverablesAnalysisRunner = serviceContainerDeliverablesAnalysis.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerDeliverablesAnalysisRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    { componentId }
  );

  return <ProductMilestoneDeliverablesAnalysisList {...{ serviceContainerDeliverablesAnalysis, componentId }} />;
};
