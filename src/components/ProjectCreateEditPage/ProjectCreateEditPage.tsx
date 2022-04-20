import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  FlexProps,
  Form,
  FormGroup,
  FormHelperText,
  Label,
  TextArea,
  TextInput,
  TextInputProps,
} from '@patternfly/react-core';
import { Project } from 'pnc-api-types-ts';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ServiceContainerCreating } from '../../containers/DataContainer/ServiceContainerCreating';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { projectService } from '../../services/projectService';
import { PageLayout } from '../PageLayout/PageLayout';

interface IProjectCreateEditPageProps {
  editPage?: boolean;
}

export const ProjectCreateEditPage = ({ editPage = false }: IProjectCreateEditPageProps) => {
  const flexDirection: FlexProps['direction'] = { default: 'column' };

  // edit page
  const [id, setId] = useState<string>('');
  const navigate = useNavigate();
  const urlPathParams = useParams();

  // FIELDS
  const [name, setName] = useState<string>('');
  const [nameValidated, setNameValidated] = useState<TextInputProps['validated']>('default');
  const [description, setDescription] = useState<string>('');
  const [projectUrl, setProjectUrl] = useState<string>('');
  const [issueTrackerUrl, setIssueTrackerUrl] = useState<string>('');
  const [engineeringTeam, setEngineeringTeam] = useState<string>('');
  const [technicalLeader, setTechnicalLeader] = useState<string>('');

  // create page
  const dataContainerCreate = useDataContainer(
    ({ serviceData }: IService<Omit<Project, 'id'>>) => projectService.createProject(serviceData!),
    {
      initLoadingState: false,
    }
  );

  // edit page
  const dataContainerCreateEdit = useDataContainer(
    useCallback(({ serviceData }: IService<Project>) => {
      return projectService.getProject(serviceData!);
    }, [])
  );
  const editRefresh = dataContainerCreateEdit.refresh;

  useEffect(() => {
    if (editPage) {
      if (urlPathParams.projectId) {
        editRefresh({ serviceData: { id: urlPathParams.projectId } }).then((response: any) => {
          const project: Project = response.data;

          setId(project.id);
          setName(project.name || '');
          setDescription(project.description || '');
          setProjectUrl(project.projectUrl || '');
          setIssueTrackerUrl(project.issueTrackerUrl || '');
          setEngineeringTeam(project.engineeringTeam || '');
          setTechnicalLeader(project.technicalLeader || '');
        });
      } else {
        throw new Error(`Invalid projectId: ${urlPathParams.projectId}`);
      }
    }
  }, [editPage, urlPathParams.projectId, editRefresh]);

  const validateName = (name: String) => {
    if (name !== '') {
      setNameValidated('success');
    } else {
      setNameValidated('error');
    }
  };

  const submitCreate = () => {
    dataContainerCreate
      .refresh({
        serviceData: {
          name,
          description,
          projectUrl,
          issueTrackerUrl,
          engineeringTeam,
          technicalLeader,
        },
      })
      .then((response: any) => {
        const projectId = response?.data?.id;
        if (!projectId) {
          throw new Error(`Invalid projectId coming from Orch POST response: ${projectId}`);
        }
        // temporarily navigate to edit page until detail page is finished
        navigate(`/projects/${projectId}/edit`, { replace: true });
      });
  };

  const submitUpdate = () => {
    // PATCH method should be used
    console.log('not implemented yet', {
      id,
      name,
      description,
      projectUrl,
      issueTrackerUrl,
      engineeringTeam,
      technicalLeader,
    });
  };

  const formComponent = (
    <Card>
      <CardBody>
        <div className="w-70">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormGroup
              isRequired
              label="Name"
              fieldId="name"
              helperText={
                <FormHelperText isHidden={nameValidated !== 'error'} isError>
                  Required field
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={nameValidated}
                type="text"
                id="name"
                name="name"
                value={name}
                autoComplete="off"
                onChange={(name) => {
                  setName(name);
                }}
                onBlur={() => {
                  validateName(name);
                }}
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="description">
              <TextArea id="description" name="description" value={description} onChange={setDescription} autoResize />
            </FormGroup>
            <FormGroup label="Project URL" fieldId="projectUrl">
              <TextInput
                isRequired
                type="url"
                id="projectUrl"
                name="projectUrl"
                autoComplete="off"
                value={projectUrl}
                onChange={setProjectUrl}
              />
            </FormGroup>
            <FormGroup label="Issue Tracker URL" fieldId="issueTrackerUrl">
              <TextInput
                type="url"
                id="issueTrackerUrl"
                name="issueTrackerUrl"
                autoComplete="off"
                value={issueTrackerUrl}
                onChange={setIssueTrackerUrl}
              />
            </FormGroup>
            <FormGroup label="Engineering Team" fieldId="engineeringTeam">
              <TextInput
                type="text"
                id="engineeringTeam"
                name="engineeringTeam"
                autoComplete="off"
                value={engineeringTeam}
                onChange={setEngineeringTeam}
              />
            </FormGroup>
            <FormGroup label="Technical Leader" fieldId="technicalLeader">
              <TextInput
                type="text"
                id="technicalLeader"
                name="technicalLeader"
                autoComplete="off"
                value={technicalLeader}
                onChange={setTechnicalLeader}
              />
            </FormGroup>
            <ActionGroup>
              <Button
                variant="primary"
                onClick={() => {
                  if (editPage) {
                    submitUpdate();
                  } else {
                    submitCreate();
                  }
                }}
              >
                {editPage ? 'Update' : 'Create'}
              </Button>
            </ActionGroup>
          </Form>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <PageLayout
      title={editPage ? 'Update Project' : 'Create Project'}
      description={
        editPage ? (
          <>You can update current project attributes below.</>
        ) : (
          <>
            You can create a standalone project like <Label>Hibernate</Label> or <Label>JBoss Modules</Label>, usually a project
            represents one SCM repository and one project may contain multiple Build Configs.
          </>
        )
      }
    >
      <Flex direction={flexDirection}>
        <FlexItem>
          {editPage ? (
            <DataContainer {...dataContainerCreateEdit} title="Edit Project">
              {formComponent}
            </DataContainer>
          ) : (
            <ServiceContainerCreating {...dataContainerCreate} title="Create Project">
              {formComponent}
            </ServiceContainerCreating>
          )}
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
