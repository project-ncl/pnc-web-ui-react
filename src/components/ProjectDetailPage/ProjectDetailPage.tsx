import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

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

        <SectionHeader
          actions={<ActionButton action={() => console.log('Not implemented yet!')}>Create Build Config</ActionButton>}
        >
          Build Configs
        </SectionHeader>
        <ContentBox borderTop>
          <div style={{ backgroundColor: 'yellow', width: '100%', height: '30vh', textAlign: 'center' }}>
            TODO: Add Build Config table here and remove the style object
          </div>
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
