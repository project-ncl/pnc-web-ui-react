import { Divider, PageSection, PageSectionVariants, TextContent, Text, Grid, GridItem } from '@patternfly/react-core';
import { DashboardWidget } from '../DashboardWidget/DashboardWidget';
import * as WebConfigAPI from '../../services/WebConfigService';

export const DashboardPage = () => {
  const webConfigData = WebConfigAPI.getWebConfig();
  const trafficLightsUrl = webConfigData?.config?.grafana?.trafficLightsUrl as string;
  const statusMapUrl = webConfigData?.config?.grafana?.statusMapUrl as string;

  return (
    <PageSection variant={PageSectionVariants.light}>
      <TextContent>
        <Text component="h1">DashboardPage</Text>
      </TextContent>
      <Divider component="div" />
      <Grid hasGutter>
        <GridItem span={6}>
          <DashboardWidget title="Service Status" src={trafficLightsUrl}></DashboardWidget>
        </GridItem>
        <GridItem span={6}>
          <DashboardWidget title="Service Status Timeline" src={statusMapUrl}></DashboardWidget>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
