import { Grid, GridItem } from '@patternfly/react-core';
import { IWebConfig } from '../../services/WebConfigService';
import { PageLayout } from '../PageLayout/PageLayout';
import { DashboardWidget } from '../DashboardWidget/DashboardWidget';
import * as WebConfigAPI from '../../services/WebConfigService';

export const DashboardPage = () => {
  const webConfigData = WebConfigAPI.getWebConfig() as IWebConfig;
  const trafficLightsUrl = webConfigData.grafana.trafficLightsUrl as string;
  const statusMapUrl = webConfigData.grafana.statusMapUrl as string;

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
