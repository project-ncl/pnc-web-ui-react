import { Divider, PageSection, PageSectionVariants, TextContent, Text, Grid, GridItem } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { DashboardWidget } from '../DashboardWidget/DashboardWidget';
import * as WebConfigAPI from '../../services/WebConfigService';

export const DashboardPage = () => {
  const webConfigData = WebConfigAPI.getWebConfig();
  const trafficLightsUrl = webConfigData?.config?.grafana?.trafficLightsUrl as string;
  const statusMapUrl = webConfigData?.config?.grafana?.statusMapUrl as string;

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
