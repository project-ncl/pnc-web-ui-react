import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ActionHeader } from '../ActionHeader/ActionHeader';
import { KeyValueTable } from '../KeyValueTable/KeyValueTable';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  const dataContainer = useDataContainer(({ requestConfig }: IService) =>
    projectService.getProject({ id: projectId as string }, requestConfig)
  );

  // TODO: Create a better solution than disabling the next line
  useEffect(() => dataContainer.refresh({ requestConfig: {} }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const attributes = {
    'Project URL': dataContainer.data?.projectUrl,
    'Issue Tracker URL': dataContainer.data?.issueTrackerUrl,
    'Engineering Team': dataContainer.data?.engineeringTeam,
    'Technical Leader': dataContainer.data?.technicalLeader,
  };

  return (
    <DataContainer {...dataContainer} title="Project Details">
      <PageLayout title={dataContainer.data?.name} description={dataContainer.data?.description}>
        <ActionHeader actionType="edit" link="edit"></ActionHeader>
        <div className="m-b-25">
          <Card>
            <CardBody>
              <KeyValueTable keyValueObject={attributes} />
            </CardBody>
          </Card>
        </div>
        <ActionHeader actionType="create" link="../create">
          Build Configs
        </ActionHeader>
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
