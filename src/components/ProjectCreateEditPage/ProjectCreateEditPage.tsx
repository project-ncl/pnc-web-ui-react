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
} from '@patternfly/react-core';
import { Project } from 'pnc-api-types-ts';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTitles } from '../../utils/PageTitles';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ServiceContainerCreating } from '../../containers/DataContainer/ServiceContainerCreating';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { useTitle } from '../../containers/useTitle';
import { projectService } from '../../services/projectService';
import { PageLayout } from '../PageLayout/PageLayout';
import { useForm } from '../../containers/useForm';
import { validateUrl } from '../../utils/formValidationHelpers';

interface IProjectCreateEditPageProps {
  editPage?: boolean;
}

export const ProjectCreateEditPage = ({ editPage = false }: IProjectCreateEditPageProps) => {
  const flexDirection: FlexProps['direction'] = { default: 'column' };

  // edit page
  const [id, setId] = useState<string>('');
  const navigate = useNavigate();
  const urlPathParams = useParams();

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

  useTitle(editPage ? `Edit | ${PageTitles.projects}` : `Create | ${PageTitles.projects}`);

  const submitCreate = (data: any) => {
    dataContainerCreate
      .refresh({
        serviceData: {
          ...data,
        },
      })
      .then((response: any) => {
        const projectId = response?.data?.id;
        if (!projectId) {
          throw new Error(`Invalid projectId coming from Orch POST response: ${projectId}`);
        }
        // temporarily navigate to edit page until detail page is finished
        navigate(`/projects/${projectId}/edit`, { replace: true });
      })
      .catch((error: any) => {});
  };

  const submitUpdate = (data: any) => {
    // PATCH method should be used
    console.log('not implemented yet', {
      id,
      ...data,
    });
  };

  const { fieldValues, fieldErrors, fieldStates, isSubmitDisabled, onChange, setFieldValues, onSubmit } = useForm(
    {
      name: '',
      description: '',
      projectUrl: '',
      issueTrackerUrl: '',
      engineeringTeam: '',
      technicalLeader: '',
    },
    {
      name: { isRequired: true },
      projectUrl: { validator: validateUrl },
      issueTrackerUrl: { validator: validateUrl },
    },
    editPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    if (editPage) {
      if (urlPathParams.projectId) {
        editRefresh({ serviceData: { id: urlPathParams.projectId } }).then((response: any) => {
          const project: Project = response.data;

          setId(project.id);
          setFieldValues({
            id: project.id || '',
            name: project.name || '',
            description: project.description || '',
            projectUrl: project.projectUrl || '',
            issueTrackerUrl: project.issueTrackerUrl || '',
            engineeringTeam: project.engineeringTeam || '',
            technicalLeader: project.technicalLeader || '',
          });
        });
      } else {
        throw new Error(`Invalid projectId: ${urlPathParams.projectId}`);
      }
    }
  }, [editPage, urlPathParams.projectId, editRefresh, setFieldValues]);

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
                <FormHelperText isHidden={fieldStates.name !== 'error'} isError>
                  {fieldErrors.name}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={fieldStates.name}
                type="text"
                id="name"
                name="name"
                value={fieldValues.name}
                autoComplete="off"
                onChange={(name, event) => {
                  onChange(event);
                }}
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="description">
              <TextArea
                id="description"
                name="description"
                value={fieldValues.description}
                onChange={(description, event) => {
                  onChange(event);
                }}
                autoResize
              />
            </FormGroup>
            <FormGroup
              label="Project URL"
              fieldId="projectUrl"
              helperText={
                <FormHelperText isHidden={fieldStates.projectUrl !== 'error'} isError>
                  {fieldErrors.projectUrl}
                </FormHelperText>
              }
            >
              <TextInput
                validated={fieldStates.projectUrl}
                type="url"
                id="projectUrl"
                name="projectUrl"
                autoComplete="off"
                value={fieldValues.projectUrl}
                onChange={(url, event) => {
                  onChange(event);
                }}
              />
            </FormGroup>
            <FormGroup
              label="Issue Tracker URL"
              fieldId="issueTrackerUrl"
              helperText={
                <FormHelperText isHidden={fieldStates.issueTrackerUrl !== 'error'} isError>
                  {fieldErrors.issueTrackerUrl}
                </FormHelperText>
              }
            >
              <TextInput
                validated={fieldStates.issueTrackerUrl}
                type="url"
                id="issueTrackerUrl"
                name="issueTrackerUrl"
                autoComplete="off"
                value={fieldValues.issueTrackerUrl}
                onChange={(url, event) => {
                  onChange(event);
                }}
              />
            </FormGroup>
            <FormGroup label="Engineering Team" fieldId="engineeringTeam">
              <TextInput
                type="text"
                id="engineeringTeam"
                name="engineeringTeam"
                autoComplete="off"
                value={fieldValues.engineeringTeam}
                onChange={(engineeringTeam, event) => {
                  onChange(event);
                }}
              />
            </FormGroup>
            <FormGroup label="Technical Leader" fieldId="technicalLeader">
              <TextInput
                type="text"
                id="technicalLeader"
                name="technicalLeader"
                autoComplete="off"
                value={fieldValues.technicalLeader}
                onChange={(url, event) => {
                  onChange(event);
                }}
              />
            </FormGroup>
            <ActionGroup>
              <Button
                variant="primary"
                isDisabled={isSubmitDisabled}
                onClick={() => {
                  onSubmit();
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
