import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as projectApi from 'services/projectApi';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  const serviceContainerProject = useServiceContainer(
    useCallback(({ requestConfig }: IService) => projectApi.getProject({ id: projectId! }, requestConfig), [projectId])
  );
  const serviceContainerProjectRefresh = serviceContainerProject.refresh;

  useTitle(`${serviceContainerProject.data?.name} | ${PageTitles.projects}`);

  useEffect(() => serviceContainerProjectRefresh({ requestConfig: {} }), [serviceContainerProjectRefresh]);

  const attributes = [
    {
      name: 'Project URL',
      value: serviceContainerProject.data?.projectUrl && (
        <a href={serviceContainerProject.data?.projectUrl} target="_blank" rel="noopener noreferrer">
          {serviceContainerProject.data?.projectUrl}
        </a>
      ),
    },
    {
      name: 'Issue Tracker URL',
      value: serviceContainerProject.data?.issueTrackerUrl && (
        <a href={serviceContainerProject.data?.issueTrackerUrl} target="_blank" rel="noopener noreferrer">
          {serviceContainerProject.data?.issueTrackerUrl}
        </a>
      ),
    },
    { name: 'Engineering Team', value: serviceContainerProject.data?.engineeringTeam },
    { name: 'Technical Leader', value: serviceContainerProject.data?.technicalLeader },
  ];

  return (
    <ServiceContainerLoading {...serviceContainerProject} title="Project Details">
      <PageLayout
        title={serviceContainerProject.data?.name}
        description={serviceContainerProject.data?.description}
        actions={<ActionButton link="edit">Edit Project</ActionButton>}
      >
        <ContentBox padding marginBottom>
          <AttributesItems attributes={attributes} />
        </ContentBox>

        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Build Configs</Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem>
            <ActionButton action={() => console.log('Not implemented yet!')}>Create Build Config</ActionButton>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop>
          <div style={{ width: '100%', height: '30vh', textAlign: 'center', paddingTop: '30px' }}>
            TODO: Add Build Config table here and remove the style object
          </div>
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
