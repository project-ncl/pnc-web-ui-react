import { ActionGroup, Button, Form, FormGroup, FormHelperText, Label, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { projectEntityAttributes } from 'common/projectEntityAttributes';

import { IFieldValues, useNewForm } from 'hooks/useNewForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as projectApi from 'services/projectApi';

import { validateUrl } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const formConfig = {
  name: {
    isRequired: true,
  },
  projectUrl: {
    validators: [{ validator: validateUrl, errorMessage: 'Invalid URL format.' }],
  },
  issueTrackerUrl: {
    validators: [{ validator: validateUrl, errorMessage: 'Invalid URL format.' }],
  },
};

interface IProjectCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProjectCreateEditPage = ({ isEditPage = false }: IProjectCreateEditPageProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(projectApi.createProject);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(projectApi.getProject);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(projectApi.patchProject);

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useNewForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Project',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: { data },
      })
      .then((response: any) => {
        const newProjectId = response?.data?.id;
        if (!newProjectId) {
          throw new Error(`Invalid projectId coming from Orch POST response: ${newProjectId}`);
        }
        navigate(`/projects/${newProjectId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create project.');
      });
  };

  const submitUpdate = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, data);

    serviceContainerEditPagePatch
      .run({ serviceData: { id: projectId, patchData } })
      .then(() => {
        navigate(`/projects/${projectId}`);
      })
      .catch(() => {
        throw new Error('Failed to edit project.');
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: projectId } }).then((response: any) => {
        setFieldValues(response.data);
      });
    }
  }, [isEditPage, projectId, serviceContainerEditPageGetRunner, setFieldValues]);

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={projectEntityAttributes.name.title}
          fieldId={projectEntityAttributes.name.id}
          helperText={
            <FormHelperText isHidden={getFieldState(projectEntityAttributes.name.id) !== 'error'} isError>
              {getFieldErrors(projectEntityAttributes.name.id)}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            type="text"
            id={projectEntityAttributes.name.id}
            name={projectEntityAttributes.name.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.name.id, formConfig.name)}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.description.title} fieldId={projectEntityAttributes.description.id}>
          <TextArea
            id={projectEntityAttributes.description.id}
            name={projectEntityAttributes.description.id}
            autoResize
            resizeOrientation="vertical"
            {...register<string>(projectEntityAttributes.description.id)}
          />
        </FormGroup>
        <FormGroup
          label={projectEntityAttributes.projectUrl.title}
          fieldId={projectEntityAttributes.projectUrl.id}
          helperText={
            <FormHelperText isHidden={getFieldState(projectEntityAttributes.projectUrl.id) !== 'error'} isError>
              {getFieldErrors(projectEntityAttributes.projectUrl.id)}
            </FormHelperText>
          }
        >
          <TextInput
            type="url"
            id={projectEntityAttributes.projectUrl.id}
            name={projectEntityAttributes.projectUrl.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.projectUrl.id, formConfig.projectUrl)}
          />
        </FormGroup>
        <FormGroup
          label={projectEntityAttributes.issueTrackerUrl.title}
          fieldId={projectEntityAttributes.issueTrackerUrl.id}
          helperText={
            <FormHelperText isHidden={getFieldState(projectEntityAttributes.issueTrackerUrl.id) !== 'error'} isError>
              {getFieldErrors(projectEntityAttributes.issueTrackerUrl.id)}
            </FormHelperText>
          }
        >
          <TextInput
            type="url"
            id={projectEntityAttributes.issueTrackerUrl.id}
            name={projectEntityAttributes.issueTrackerUrl.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.issueTrackerUrl.id, formConfig.issueTrackerUrl)}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.engineeringTeam.title} fieldId={projectEntityAttributes.engineeringTeam.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.engineeringTeam.id}
            name={projectEntityAttributes.engineeringTeam.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.engineeringTeam.id)}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.technicalLeader.title} fieldId={projectEntityAttributes.technicalLeader.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.technicalLeader.id}
            name={projectEntityAttributes.technicalLeader.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.technicalLeader.id)}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled}
            onClick={handleSubmit(isEditPage ? submitUpdate : submitCreate)}
          >
            {isEditPage ? 'Update' : 'Create'} Project
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? 'Update Project' : 'Create Project'}
      description={
        isEditPage ? (
          <>You can update current project attributes below.</>
        ) : (
          <>
            You can create a standalone project like <Label>Hibernate</Label> or <Label>JBoss Modules</Label>, usually a project
            represents one SCM repository and one project may contain multiple Build Configs.
          </>
        )
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Project"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
