import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { DeliverablesAnalysesList } from 'components/DeliverablesAnalysesList/DeliverablesAnalysesList';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneDeliverablesAnalysisPage {
  componentId?: string;
}

export const ProductMilestoneDeliverablesAnalysisPage = ({ componentId = 'c1' }: IProductMilestoneDeliverablesAnalysisPage) => {
  const { productMilestoneId } = useParamsRequired();

  const serviceContainerDeliverablesAnalyses = useServiceContainer(productMilestoneApi.getDeliverablesAnalysis);
  const serviceContainerDeliverablesAnalysesRunner = serviceContainerDeliverablesAnalyses.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerDeliverablesAnalysesRunner({ serviceData: { id: productMilestoneId }, requestConfig }),
    { componentId }
  );

  return <DeliverablesAnalysesList {...{ serviceContainerDeliverablesAnalyses, componentId }} />;
};
