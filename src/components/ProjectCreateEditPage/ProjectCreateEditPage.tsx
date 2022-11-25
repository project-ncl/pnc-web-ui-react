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
import { Operation } from 'fast-json-patch';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { DataContainer } from 'hooks/DataContainer/DataContainer';
import { ServiceContainerCreatingUpdating } from 'hooks/DataContainer/ServiceContainerCreatingUpdating';
import { IFields, useForm } from 'hooks/useForm';
import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';

import * as projectService from 'services/projectService';

import { PageTitles } from 'utils/PageTitles';
import { validateUrl } from 'utils/formValidationHelpers';
import { createSafePatch, transformFormToValues } from 'utils/patchHelper';

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

  // edit page:
  // on edit page, use patch data container (or get data container)?
  const [isPatching, setIsPatching] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const navigate = useNavigate();
  const urlPathParams = useParams();

  // create page
  const dataContainerCreate = useServiceContainer(
    ({ serviceData }: IService<Omit<Project, 'id'>>) => projectService.createProject(serviceData!),
    {
      initLoadingState: false,
    }
  );

  // edit page - get method
  const dataContainerEditGet = useServiceContainer(
    useCallback(({ serviceData }: IService<Project>) => {
      return projectService.getProject(serviceData!);
    }, [])
  );
  const editRefreshGet = dataContainerEditGet.refresh;

  // edit page - patch method
  const dataContainerEditPatch = useServiceContainer(
    useCallback(
      ({ serviceData }: IService<Operation[]>) => {
        return projectService.patchProject(id, serviceData!);
      },
      [id]
    ),
    {
      initLoadingState: false,
    }
  );
  const editRefreshPatch = dataContainerEditPatch.refresh;

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
        navigate(`/projects/${projectId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create project.');
      });
  };

  const submitUpdate = (data: IFields) => {
    const patchData = transformFormToValues(data);
    const patch = createSafePatch(dataContainerEditGet.data, patchData);

    editRefreshPatch({ serviceData: patch })
      .then((response: any) => {
        navigate(`/projects/${id}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to edit project.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    formConfig,
    editPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    if (editPage) {
      if (urlPathParams.projectId) {
        editRefreshGet({ serviceData: { id: urlPathParams.projectId } }).then((response: any) => {
          const project: Project = response.data;

          setIsPatching(true);
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
  }, [editPage, urlPathParams.projectId, editRefreshGet, reinitialize]);

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
            isPatching ? (
              <ServiceContainerCreatingUpdating {...dataContainerEditPatch} title="Edit Project">
                {formComponent}
              </ServiceContainerCreatingUpdating>
            ) : (
              /* used just to GET project data, after that is immediately switched to patch container */
              <DataContainer {...dataContainerEditGet} title="Edit Project">
                {/* no content is needed */}
              </DataContainer>
            )
          ) : (
            <ServiceContainerCreatingUpdating {...dataContainerCreate} title="Create Project">
              {formComponent}
            </ServiceContainerCreatingUpdating>
          )}
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
