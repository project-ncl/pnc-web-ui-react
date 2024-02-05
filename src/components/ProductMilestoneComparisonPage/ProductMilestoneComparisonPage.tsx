import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductMilestoneComparisonTable } from 'components/ProductMilestoneComparisonTable/ProductMilestoneComparisonTable';

import * as productMilestoneApi from 'services/productMilestoneApi';

interface IProductMilestoneComparisonPageProps {
  componentId?: string;
}

export const ProductMilestoneComparisonPage = ({ componentId = 't1' }: IProductMilestoneComparisonPageProps) => {
  const serviceContainerProductMilestoneComparisonTable = useServiceContainer(productMilestoneApi.getProductMilestoneComparison);

  useTitle(PageTitles.productMilestoneComparison);

  return (
    <PageLayout
      title={PageTitles.productMilestoneComparison}
      description={
        <>
          List of Delivered Artifacts, for example <Label>regexp:regexp:jar</Label>, and their versions in selected Product
          Milestones, for example <Label>Red Hat Single Sign-On 7.1.2.CR1</Label>.
        </>
      }
    >
      <ExperimentalContent>
        <ExperimentalContentMarker dataSource="mock" contentType="box" showTooltip>
          <ProductMilestoneComparisonTable {...{ serviceContainerProductMilestoneComparisonTable, componentId }} />
        </ExperimentalContentMarker>
      </ExperimentalContent>
    </PageLayout>
  );
};
