import { Card, CardBody } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as projectService from 'services/projectService';

import { PageTitles } from 'utils/PageTitles';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  const serviceContainerProject = useServiceContainer(
    useCallback(({ requestConfig }: IService) => projectService.getProject({ id: projectId! }, requestConfig), [projectId])
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
      <PageLayout title={serviceContainerProject.data?.name} description={serviceContainerProject.data?.description}>
        <SectionHeader
          actions={
            <ActionButton link="edit" iconType="edit">
              Edit
            </ActionButton>
          }
        />
        <div className="m-b-25">
          <Card>
            <CardBody>
              <AttributesItems attributes={attributes} />
            </CardBody>
          </Card>
        </div>
        <SectionHeader
          actions={
            <ActionButton action={() => console.log('Not implemented yet!')} iconType="create">
              Create
            </ActionButton>
          }
        >
          Build Configs
        </SectionHeader>
        <div className="m-b-25">
          <Card>
            <CardBody>
              <div style={{ backgroundColor: 'yellow', width: '100%', height: '30vh', textAlign: 'center' }}>
                TODO: Add Build Config table here and remove the style object
              </div>
            </CardBody>
          </Card>
        </div>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
