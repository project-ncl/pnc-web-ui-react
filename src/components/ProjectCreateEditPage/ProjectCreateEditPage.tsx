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
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { ServiceContainerCreating } from '../../containers/DataContainer/ServiceContainerCreating';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { IFields, useForm } from '../../containers/useForm';
import { useTitle } from '../../containers/useTitle';

import { projectService } from '../../services/projectService';

import { PageTitles } from '../../utils/PageTitles';
import { validateUrl } from '../../utils/formValidationHelpers';

import { PageLayout } from '../PageLayout/PageLayout';

interface IProjectCreateEditPageProps {
  editPage?: boolean;
}

const formConfig = {
  name: {
    isRequired: true,
  },
  description: {},
  projectUrl: {
    validators: [{ validator: validateUrl, errorMessage: 'Invalid URL format.' }],
  },
  issueTrackerUrl: {
    validators: [{ validator: validateUrl, errorMessage: 'Invalid URL format.' }],
  },
  engineeringTeam: {},
  technicalLeader: {},
};

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

  const submitCreate = (data: IFields) => {
    return dataContainerCreate
      .refresh({
        serviceData: {
          name: data.name.value,
          description: data.description.value,
          projectUrl: data.projectUrl.value,
          issueTrackerUrl: data.issueTrackerUrl.value,
          engineeringTeam: data.engineeringTeam.value,
          technicalLeader: data.technicalLeader.value,
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

  const submitUpdate = (data: IFields) => {
    // PATCH method should be used
    console.log('not implemented yet', {
      id,
      ...data,
    });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    formConfig,
    editPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    if (editPage) {
      if (urlPathParams.projectId) {
        editRefresh({ serviceData: { id: urlPathParams.projectId } }).then((response: any) => {
          const project: Project = response.data;

          setId(project.id);
          reinitialize({
            name: project.name,
            description: project.description,
            projectUrl: project.projectUrl,
            issueTrackerUrl: project.issueTrackerUrl,
            engineeringTeam: project.engineeringTeam,
            technicalLeader: project.technicalLeader,
          });
        });
      } else {
        throw new Error(`Invalid projectId: ${urlPathParams.projectId}`);
      }
    }
  }, [editPage, urlPathParams.projectId, editRefresh, reinitialize]);

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
                <FormHelperText isHidden={fields.name.state !== 'error'} isError>
                  {fields.name.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={fields.name.state}
                type="text"
                id="name"
                name="name"
                value={fields.name.value}
                autoComplete="off"
                onChange={(name) => {
                  onChange('name', name);
                }}
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="description">
              <TextArea
                id="description"
                name="description"
                value={fields.description.value}
                onChange={(description) => {
                  onChange('description', description);
                }}
                autoResize
              />
            </FormGroup>
            <FormGroup
              label="Project URL"
              fieldId="projectUrl"
              helperText={
                <FormHelperText isHidden={fields.projectUrl.state !== 'error'} isError>
                  {fields.projectUrl.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                validated={fields.projectUrl.state}
                type="url"
                id="projectUrl"
                name="projectUrl"
                autoComplete="off"
                value={fields.projectUrl.value}
                onChange={(url) => {
                  onChange('projectUrl', url);
                }}
              />
            </FormGroup>
            <FormGroup
              label="Issue Tracker URL"
              fieldId="issueTrackerUrl"
              helperText={
                <FormHelperText isHidden={fields.issueTrackerUrl.state !== 'error'} isError>
                  {fields.issueTrackerUrl.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                validated={fields.issueTrackerUrl.state}
                type="url"
                id="issueTrackerUrl"
                name="issueTrackerUrl"
                autoComplete="off"
                value={fields.issueTrackerUrl.value}
                onChange={(url) => {
                  onChange('issueTrackerUrl', url);
                }}
              />
            </FormGroup>
            <FormGroup label="Engineering Team" fieldId="engineeringTeam">
              <TextInput
                type="text"
                id="engineeringTeam"
                name="engineeringTeam"
                autoComplete="off"
                value={fields.engineeringTeam.value}
                onChange={(engineeringTeam) => {
                  onChange('engineeringTeam', engineeringTeam);
                }}
              />
            </FormGroup>
            <FormGroup label="Technical Leader" fieldId="technicalLeader">
              <TextInput
                type="text"
                id="technicalLeader"
                name="technicalLeader"
                autoComplete="off"
                value={fields.technicalLeader.value}
                onChange={(technicalLeader) => {
                  onChange('technicalLeader', technicalLeader);
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
