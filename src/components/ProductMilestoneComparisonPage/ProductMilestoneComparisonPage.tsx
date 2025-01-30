import { Label } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductMilestoneComparisonTable } from 'components/ProductMilestoneComparisonTable/ProductMilestoneComparisonTable';

import * as productMilestoneApi from 'services/productMilestoneApi';

export const ProductMilestoneComparisonPage = () => {
  const serviceContainerProductMilestoneComparisonTable = useServiceContainer(productMilestoneApi.getProductMilestoneComparison);

  useTitle(PageTitles.productMilestoneComparison);

  return (
    <PageLayout
      title={PageTitles.productMilestoneComparison}
      description={
        <>
          List of Delivered Artifact prefixes, for example <Label>regexp:regexp:jar</Label>, and versions they were delivered in
          selected Product Milestones, for example <Label>Red Hat Single Sign-On 7.1.2.CR1</Label>.
        </>
      }
    >
      <ProductMilestoneComparisonTable {...{ serviceContainerProductMilestoneComparisonTable }} />
    </PageLayout>
  );
};
