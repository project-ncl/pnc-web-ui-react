import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { AttributesItems } from '../AttributesItems/AttributesItems';
import { ActionButton } from '../ActionButton/ActionButton';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  const dataContainer = useDataContainer(({ requestConfig }: IService) =>
    projectService.getProject({ id: projectId as string }, requestConfig)
  );

  // TODO: Create a better solution than disabling the next line
  useEffect(() => dataContainer.refresh({ requestConfig: {} }), []); // eslint-disable-line react-hooks/exhaustive-deps

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
