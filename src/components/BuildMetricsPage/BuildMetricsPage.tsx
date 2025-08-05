import { BuildMetrics } from 'components/BuildMetrics/BuildMetrics';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';

interface IBuildMetricsPageProps {
  componentId?: string;
}

export const BuildMetricsPage = ({ componentId = 'm1' }: IBuildMetricsPageProps) => {
  const { serviceContainerBuild } = useServiceContainerBuild();

  return (
    <ContentBox>
      <BuildMetrics builds={[serviceContainerBuild.data!]} chartType="horizontalBar" componentId={componentId} />
    </ContentBox>
  );
};
