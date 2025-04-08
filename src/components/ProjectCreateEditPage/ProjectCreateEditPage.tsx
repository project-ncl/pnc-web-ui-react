import { ActionGroup, Button, Form, FormGroup, Label, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Project } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { projectEntityAttributes } from 'common/projectEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as projectApi from 'services/projectApi';

import { maxLengthValidator, urlValidator } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const fieldConfigs = {
  name: {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
  projectUrl: {
    validators: [urlValidator, maxLengthValidator(255)],
  },
  issueTrackerUrl: {
    validators: [urlValidator, maxLengthValidator(255)],
  },
  engineeringTeam: {
    validators: [maxLengthValidator(255)],
  },
  technicalLeader: {
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

interface IProjectCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProjectCreateEditPage = ({ isEditPage = false }: IProjectCreateEditPageProps) => {
  const { projectId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(projectApi.createProject);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(projectApi.getProject);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(projectApi.patchProject);

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Project',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage.run({
      serviceData: { data: data as Project },
      onSuccess: (result) => {
        const newProjectId = result.response.data.id;
        if (!newProjectId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid projectId coming from Orch POST response: ${newProjectId}`,
          });
        }
        navigate(`/projects/${newProjectId}`);
      },
      onError: () => {
        console.error('Failed to create Project.');
      },
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, data);

    return serviceContainerEditPagePatch.run({
      serviceData: { id: projectId, patchData },
      onSuccess: () => navigate(`/projects/${projectId}`),
      onError: () => console.error('Failed to edit Project.'),
    });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: projectId },
        onSuccess: (result) => setFieldValues(result.response.data),
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
        <FormGroup isRequired label={projectEntityAttributes.name.title} fieldId={projectEntityAttributes.name.id}>
          <TextInput
            isRequired
            type="text"
            id={projectEntityAttributes.name.id}
            name={projectEntityAttributes.name.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.name.id, fieldConfigs.name)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(projectEntityAttributes.name.id)}</FormInputHelperText>
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
        <FormGroup label={projectEntityAttributes.projectUrl.title} fieldId={projectEntityAttributes.projectUrl.id}>
          <TextInput
            type="url"
            id={projectEntityAttributes.projectUrl.id}
            name={projectEntityAttributes.projectUrl.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.projectUrl.id, fieldConfigs.projectUrl)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(projectEntityAttributes.projectUrl.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup label={projectEntityAttributes.issueTrackerUrl.title} fieldId={projectEntityAttributes.issueTrackerUrl.id}>
          <TextInput
            type="url"
            id={projectEntityAttributes.issueTrackerUrl.id}
            name={projectEntityAttributes.issueTrackerUrl.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.issueTrackerUrl.id, fieldConfigs.issueTrackerUrl)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(projectEntityAttributes.issueTrackerUrl.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup label={projectEntityAttributes.engineeringTeam.title} fieldId={projectEntityAttributes.engineeringTeam.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.engineeringTeam.id}
            name={projectEntityAttributes.engineeringTeam.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.engineeringTeam.id, fieldConfigs.engineeringTeam)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(projectEntityAttributes.engineeringTeam.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup label={projectEntityAttributes.technicalLeader.title} fieldId={projectEntityAttributes.technicalLeader.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.technicalLeader.id}
            name={projectEntityAttributes.technicalLeader.id}
            autoComplete="off"
            {...register<string>(projectEntityAttributes.technicalLeader.id, fieldConfigs.technicalLeader)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(projectEntityAttributes.technicalLeader.id)}</FormInputHelperText>
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}>
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.project}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.projectEdit : PageTitles.projectCreate}
      breadcrumbs={
        isEditPage
          ? [
              { entity: breadcrumbData.project.id, title: serviceContainerEditPageGet.data?.name, url: '-/edit' },
              { entity: breadcrumbData.edit.id, title: PageTitles.projectEdit, custom: true },
            ]
          : [{ entity: breadcrumbData.create.id, title: PageTitles.projectCreate }]
      }
      description={
        isEditPage ? (
          <>You can edit current project attributes below.</>
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
          hasFormChanged={hasFormChanged}
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage} hasFormChanged={hasFormChanged}>
          {formComponent}
        </ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
