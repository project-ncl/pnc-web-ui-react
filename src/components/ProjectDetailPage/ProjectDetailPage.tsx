import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardTitle, CardBody, FlexItem, Flex } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ActionHeader } from '../ActionButton/ActionButton';

const ProjectAttribute = ({ attribute, value }: { attribute: string; value: string }) => {
  return (
    <>
      <span style={{ fontWeight: 'bold' }}>{attribute}</span>
      <span style={{ ...(!value && { color: 'grey', fontStyle: 'italic' }) }}>{value ?? 'Empty'}</span>
    </>
  );
};

export const ProjectDetailPage = () => {
  const { id } = useParams();

  const dataContainer = useDataContainer((requestConfig: Object) => projectService.getProject(requestConfig, id!));

  // TODO: Create a better solution than disabling the next line
  useEffect(() => dataContainer.refresh({ id }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DataContainer {...dataContainer} title="Project Details">
      <PageLayout title={dataContainer.data?.name} description={dataContainer.data?.description}>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <Card>
              <CardTitle>
                <ActionHeader actionType="edit" text="Attributes" />
              </CardTitle>
              <CardBody>
                <Grid span={5} hasGutter component={'span'}>
                  <ProjectAttribute attribute="Project URL" value={dataContainer.data?.projectUrl} />
                  <ProjectAttribute attribute="Issue Tracker URL" value={dataContainer.data?.issueTrackerUrl} />
                  <ProjectAttribute attribute="Engineering Team" value={dataContainer.data?.engineeringTeam} />
                  <ProjectAttribute attribute="Technical Leader" value={dataContainer.data?.technicalLeader} />
                </Grid>
              </CardBody>
            </Card>
          </FlexItem>

          <FlexItem>
            <Card>
              <CardTitle>
                <ActionHeader actionType="create" text="Build Configs" />
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
