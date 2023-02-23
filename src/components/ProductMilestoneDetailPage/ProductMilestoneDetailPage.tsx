import { ContentBox } from 'components/ContentBox/ContentBox';
import { useServiceContainerMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';

export const ProductMilestoneDetailPage = () => {
  const { serviceContainerMilestone } = useServiceContainerMilestone();
  console.log('TEMPORARY:', serviceContainerMilestone);

  return <ContentBox padding marginBottom></ContentBox>;
};
