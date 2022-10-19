import { Card, CardBody } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { useTitle } from '../../containers/useTitle';

import * as projectService from '../../services/projectService';

import { PageTitles } from '../../utils/PageTitles';

import { ActionButton } from '../ActionButton/ActionButton';
import { AttributesItems } from '../AttributesItems/AttributesItems';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { PageLayout } from './../PageLayout/PageLayout';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  const dataContainer = useDataContainer(
    useCallback(({ requestConfig }: IService) => projectService.getProject({ id: projectId! }, requestConfig), [projectId])
  );
  const dataContainerRefresh = dataContainer.refresh;

  useTitle(`${dataContainer.data?.name} | ${PageTitles.projects}`);

  useEffect(() => dataContainerRefresh({ requestConfig: {} }), [dataContainerRefresh]);

  const attributes = [
    {
      name: 'Project URL',
      value: dataContainer.data?.projectUrl && (
        <a href={dataContainer.data?.projectUrl} target="_blank" rel="noopener noreferrer">
          {dataContainer.data?.projectUrl}
        </a>
      ),
    },
    {
      name: 'Issue Tracker URL',
      value: dataContainer.data?.issueTrackerUrl && (
        <a href={dataContainer.data?.issueTrackerUrl} target="_blank" rel="noopener noreferrer">
          {dataContainer.data?.issueTrackerUrl}
        </a>
      ),
    },
    { name: 'Engineering Team', value: dataContainer.data?.engineeringTeam },
    { name: 'Technical Leader', value: dataContainer.data?.technicalLeader },
  ];

  return (
    <DataContainer {...dataContainer} title="Project Details">
      <PageLayout title={dataContainer.data?.name} description={dataContainer.data?.description}>
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
    </DataContainer>
  );
};
