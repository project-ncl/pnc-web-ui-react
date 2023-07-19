import {
  ActionGroup,
  Button,
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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { projectEntityAttributes } from 'common/projectEntityAttributes';

import { IFields, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as projectApi from 'services/projectApi';

import { validateUrl } from 'utils/formValidationHelpers';
import { createSafePatch, transformFormToValues } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IProjectCreateEditPageProps {
  isEditPage?: boolean;
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

export const ProjectCreateEditPage = ({ isEditPage = false }: IProjectCreateEditPageProps) => {
  const flexDirection: FlexProps['direction'] = { default: 'column' };

  const [id, setId] = useState<string>('');
  const navigate = useNavigate();
  const urlPathParams = useParams();

  // create page
  const serviceContainerCreatePage = useServiceContainer(projectApi.createProject);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(projectApi.getProject);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(projectApi.patchProject);

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Project',
    })
  );

  const submitCreate = (data: IFields) => {
    return serviceContainerCreatePage
      .run({
        serviceData: {
          data: {
            name: data.name.value,
            description: data.description.value,
            projectUrl: data.projectUrl.value,
            issueTrackerUrl: data.issueTrackerUrl.value,
            engineeringTeam: data.engineeringTeam.value,
            technicalLeader: data.technicalLeader.value,
          },
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
    const patchData = createSafePatch(serviceContainerEditPageGet.data, transformFormToValues(data));

    serviceContainerEditPagePatch
      .run({ serviceData: { id, patchData } })
      .then(() => {
        navigate(`/projects/${id}`);
      })
      .catch(() => {
        throw new Error('Failed to edit project.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    formConfig,
    isEditPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    if (isEditPage) {
      if (urlPathParams.projectId) {
        serviceContainerEditPageGetRunner({ serviceData: { id: urlPathParams.projectId } }).then((response: any) => {
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
  }, [isEditPage, urlPathParams.projectId, serviceContainerEditPageGetRunner, reinitialize]);

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
            <FormHelperText isHidden={fields.name.state !== 'error'} isError>
              {fields.name.errorMessages?.join(' ')}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            validated={fields.name.state}
            type="text"
            id={projectEntityAttributes.name.id}
            name={projectEntityAttributes.name.id}
            value={fields.name.value as string}
            autoComplete="off"
            onChange={(name) => {
              onChange('name', name);
            }}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.description.title} fieldId={projectEntityAttributes.description.id}>
          <TextArea
            id={projectEntityAttributes.description.id}
            name={projectEntityAttributes.description.id}
            value={fields.description.value as string}
            onChange={(description) => {
              onChange('description', description);
            }}
            autoResize
          />
        </FormGroup>
        <FormGroup
          label={projectEntityAttributes.projectUrl.title}
          fieldId={projectEntityAttributes.projectUrl.id}
          helperText={
            <FormHelperText isHidden={fields.projectUrl.state !== 'error'} isError>
              {fields.projectUrl.errorMessages?.join(' ')}
            </FormHelperText>
          }
        >
          <TextInput
            validated={fields.projectUrl.state}
            type="url"
            id={projectEntityAttributes.projectUrl.id}
            name={projectEntityAttributes.projectUrl.id}
            autoComplete="off"
            value={fields.projectUrl.value as string}
            onChange={(url) => {
              onChange('projectUrl', url);
            }}
          />
        </FormGroup>
        <FormGroup
          label={projectEntityAttributes.issueTrackerUrl.title}
          fieldId={projectEntityAttributes.issueTrackerUrl.id}
          helperText={
            <FormHelperText isHidden={fields.issueTrackerUrl.state !== 'error'} isError>
              {fields.issueTrackerUrl.errorMessages?.join(' ')}
            </FormHelperText>
          }
        >
          <TextInput
            validated={fields.issueTrackerUrl.state}
            type="url"
            id={projectEntityAttributes.issueTrackerUrl.id}
            name={projectEntityAttributes.issueTrackerUrl.id}
            autoComplete="off"
            value={fields.issueTrackerUrl.value as string}
            onChange={(url) => {
              onChange('issueTrackerUrl', url);
            }}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.engineeringTeam.title} fieldId={projectEntityAttributes.engineeringTeam.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.engineeringTeam.id}
            name={projectEntityAttributes.engineeringTeam.id}
            autoComplete="off"
            value={fields.engineeringTeam.value as string}
            onChange={(engineeringTeam) => {
              onChange('engineeringTeam', engineeringTeam);
            }}
          />
        </FormGroup>
        <FormGroup label={projectEntityAttributes.technicalLeader.title} fieldId={projectEntityAttributes.technicalLeader.id}>
          <TextInput
            type="text"
            id={projectEntityAttributes.technicalLeader.id}
            name={projectEntityAttributes.technicalLeader.id}
            autoComplete="off"
            value={fields.technicalLeader.value as string}
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
      <Flex direction={flexDirection}>
        <FlexItem>
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
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
