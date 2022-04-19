import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardTitle, CardBody, FlexItem, Flex } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ActionHeader } from '../ActionHeader/ActionHeader';
import { NameValueText } from '../NameValueText/NameValueText';

export const ProjectDetailPage = () => {
  const { id } = useParams();

  const dataContainer = useDataContainer(({ requestConfig }: IService) =>
    projectService.getProject({ id: id as string }, requestConfig)
  );

  // TODO: Create a better solution than disabling the next line
  useEffect(() => dataContainer.refresh({ serviceData: { id }, requestConfig: {} }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DataContainer {...dataContainer} title="Project Details">
      <PageLayout title={dataContainer.data?.name} description={dataContainer.data?.description}>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <Card>
              <CardTitle>
                <ActionHeader actionType="edit">Attributes</ActionHeader>
              </CardTitle>
              <CardBody>
                <Grid span={5} hasGutter component={'span'}>
                  <NameValueText name="Project URL" value={dataContainer.data?.projectUrl} />
                  <NameValueText name="Issue Tracker URL" value={dataContainer.data?.issueTrackerUrl} />
                  <NameValueText name="Engineering Team" value={dataContainer.data?.engineeringTeam} />
                  <NameValueText name="Technical Leader" value={dataContainer.data?.technicalLeader} />
                </Grid>
              </CardBody>
            </Card>
          </FlexItem>

          <FlexItem>
            <Card>
              <CardTitle>
                <ActionHeader actionType="create">Build Configs</ActionHeader>
              </CardTitle>
              <CardBody>
                <div style={{ backgroundColor: 'yellow', width: '100%', height: '30vh', textAlign: 'center' }}>
                  TODO: Add Build Config table here
                </div>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </PageLayout>
    </DataContainer>
  );
};
