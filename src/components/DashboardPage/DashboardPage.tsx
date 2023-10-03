import { Grid, GridItem, Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { DashboardWidget } from 'components/DashboardWidget/DashboardWidget';
import { GroupBuildsList } from 'components/GroupBuildsList/GroupBuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as buildApi from 'services/buildApi';
import * as groupBuildApi from 'services/groupBuildApi';
import { userService } from 'services/userService';
import * as webConfigService from 'services/webConfigService';

export const DashboardPage = () => {
  const webConfig = webConfigService.getWebConfig();
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
        <GridItem lg={12} xl2={6}>
          <DashboardWidget title="Service Status" src={trafficLightsUrl}></DashboardWidget>
        </GridItem>
        <GridItem lg={12} xl2={6}>
          <DashboardWidget title="Service Status Timeline" src={statusMapUrl}></DashboardWidget>
        </GridItem>
        <ProtectedComponent hide>
          <GridItem lg={12} xl2={6}>
            <Toolbar borderBottom>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>My Builds</Text>
                </TextContent>
              </ToolbarItem>
            </Toolbar>

            <MyBuildsList />
          </GridItem>
          <GridItem lg={12} xl2={6}>
            <Toolbar borderBottom>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>My Group Builds</Text>
                </TextContent>
              </ToolbarItem>
            </Toolbar>

            <MyGroupBuildsList />
          </GridItem>
        </ProtectedComponent>
      </Grid>
    </PageLayout>
  );
};

const userBuildsListColumns = [
  buildEntityAttributes.status.id,
  buildEntityAttributes.name.id,
  buildEntityAttributes.submitTime.id,
  buildEntityAttributes.startTime.id,
  buildEntityAttributes.endTime.id,
];

interface IMyBuildsListProps {
  componentId?: string;
}

const MyBuildsList = ({ componentId = 'b1' }: IMyBuildsListProps) => {
  const serviceContainerUserBuilds = useServiceContainer(buildApi.getUserBuilds);
  const serviceContainerUserBuildsRunner = serviceContainerUserBuilds.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerUserBuildsRunner({ serviceData: { userId: userService.getUserId() }, requestConfig }),
    { componentId }
  );

  return (
    <BuildsList serviceContainerBuilds={serviceContainerUserBuilds} columns={userBuildsListColumns} componentId={componentId} />
  );
};

const userGroupBuildsListColumns = [
  groupBuildEntityAttributes.status.id,
  groupBuildEntityAttributes.name.id,
  groupBuildEntityAttributes.startTime.id,
  groupBuildEntityAttributes.endTime.id,
];

interface IMyGroupBuildsListProps {
  componentId?: string;
}

const MyGroupBuildsList = ({ componentId = 'g1' }: IMyGroupBuildsListProps) => {
  const serviceContainerUserGroupBuilds = useServiceContainer(groupBuildApi.getUserGroupBuilds);
  const serviceContainerUserGroupBuildsRunner = serviceContainerUserGroupBuilds.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) =>
      serviceContainerUserGroupBuildsRunner({ serviceData: { userId: userService.getUserId() }, requestConfig }),
    { componentId }
  );

  return (
    <GroupBuildsList
      serviceContainerGroupBuilds={serviceContainerUserGroupBuilds}
      columns={userGroupBuildsListColumns}
      componentId={componentId}
    />
  );
};
