import { Grid, GridItem } from '@patternfly/react-core';
import { PageLayout } from '../PageLayout/PageLayout';
import { DashboardWidget } from '../DashboardWidget/DashboardWidget';
import * as WebConfigAPI from '../../services/WebConfigService';
import { useTitle } from '../../containers/useTitle';

export const DashboardPage = () => {
  const webConfig = WebConfigAPI.getWebConfig();
  const trafficLightsUrl = webConfig.grafana.trafficLightsUrl;
  const statusMapUrl = webConfig.grafana.statusMapUrl;

  useTitle('Dashboard');

  return (
    <PageLayout
      title="Dashboard"
      description={
        <>
          The dashboard page contains the status of relevant services and the list of the builds and group builds triggered by the
          current user.
        </>
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <DashboardWidget title="Service Status" src={trafficLightsUrl}></DashboardWidget>
        </GridItem>
        <GridItem span={6}>
          <DashboardWidget title="Service Status Timeline" src={statusMapUrl}></DashboardWidget>
        </GridItem>
      </Grid>
    </PageLayout>
  );
};
