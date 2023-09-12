import { ActionGroup, Button, Form, FormGroup, FormHelperText, Switch, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInput } from 'components/FormInput/FormInput';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IScmRepositoryCreateEditPageProps {
  isEditPage?: boolean;
}

const createFieldConfigs = {
  scmUrl: {
    isRequired: true,
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid SCM URL format.' }],
  },
  preBuildSyncEnabled: {
    value: true,
  },
} satisfies IFieldConfigs;

const editFieldConfigs = {
  externalUrl: {
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid SCM URL format.' }],
  },
} satisfies IFieldConfigs;

export const ScmRepositoryCreateEditPage = ({ isEditPage = false }: IScmRepositoryCreateEditPageProps) => {
  const { scmRepositoryId } = useParams();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(scmRepositoryApi.createScmRepository);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(scmRepositoryApi.patchScmRepository);

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      entityName: generateScmRepositoryName({ scmRepository: serviceContainerEditPageGet.data }),
      firstLevelEntity: 'SCM Repository',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: { data },
      })
      .then((response: any) => {
        // @Todo: Verify the create result from the WS Message after WS was implemented, see NCL-7935.
        // navigate(`/scm-repositories/${scmRepositoryId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create SCM Repository.');
      });
  };

  const submitUpdate = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, data);

    serviceContainerEditPagePatch
      .run({ serviceData: { id: scmRepositoryId, patchData } })
      .then(() => {
        navigate(`/scm-repositories/${scmRepositoryId}`);
      })
      .catch(() => {
        throw new Error('Failed to edit SCM Repository.');
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: scmRepositoryId } }).then((response: any) => {
        setFieldValues(response.data);
      });
    }
  }, [isEditPage, scmRepositoryId, serviceContainerEditPageGetRunner, setFieldValues]);

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {!isEditPage && (
          <FormGroup
            isRequired
            label={scmRepositoryEntityAttributes.scmUrl.title}
            fieldId={scmRepositoryEntityAttributes.scmUrl.id}
            labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.scmUrl.tooltip} />}
            helperText={
              <FormHelperText isHidden={getFieldState(scmRepositoryEntityAttributes.scmUrl.id) !== 'error'} isError>
                {getFieldErrors(scmRepositoryEntityAttributes.scmUrl.id)}
              </FormHelperText>
            }
          >
            <TextInput
              isRequired
              type="text"
              id={scmRepositoryEntityAttributes.scmUrl.id}
              name={scmRepositoryEntityAttributes.scmUrl.id}
              autoComplete="off"
              {...register<string>(scmRepositoryEntityAttributes.scmUrl.id, createFieldConfigs.scmUrl)}
            />
          </FormGroup>
        )}
        {isEditPage && (
          <>
            <FormGroup
              label={scmRepositoryEntityAttributes.internalUrl.title}
              fieldId={scmRepositoryEntityAttributes.internalUrl.id}
              labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.internalUrl.tooltip} />}
            >
              {serviceContainerEditPageGet.data && <ScmRepositoryUrl internalScmRepository={serviceContainerEditPageGet.data} />}
            </FormGroup>
            <FormGroup
              label={scmRepositoryEntityAttributes.externalUrl.title}
              fieldId={scmRepositoryEntityAttributes.externalUrl.id}
              labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.externalUrl.tooltip} />}
              helperText={
                <FormHelperText isHidden={getFieldState(scmRepositoryEntityAttributes.externalUrl.id) !== 'error'} isError>
                  {getFieldErrors(scmRepositoryEntityAttributes.externalUrl.id)}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                type="text"
                id={scmRepositoryEntityAttributes.externalUrl.id}
                name={scmRepositoryEntityAttributes.externalUrl.id}
                autoComplete="off"
                {...register<string>(scmRepositoryEntityAttributes.externalUrl.id, editFieldConfigs.externalUrl)}
              />
            </FormGroup>
          </>
        )}
        <FormGroup
          label={scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
          fieldId={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
          labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip} />}
          helperText={
            <FormHelperText isHidden={getFieldState(scmRepositoryEntityAttributes.preBuildSyncEnabled.id) !== 'error'} isError>
              {getFieldErrors(scmRepositoryEntityAttributes.preBuildSyncEnabled.id)}
            </FormHelperText>
          }
        >
          <FormInput<boolean>
            {...register<boolean>(
              scmRepositoryEntityAttributes.preBuildSyncEnabled.id,
              !isEditPage ? createFieldConfigs.preBuildSyncEnabled : undefined
            )}
            render={({ value, onChange, onBlur }) => (
              <Switch
                id={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                name={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                label="Pre-build Sync Enabled"
                labelOff="Pre-build Sync Disabled"
                isChecked={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled}
            onClick={handleSubmit(isEditPage ? submitUpdate : submitCreate)}
          >
            {isEditPage ? 'Update' : 'Create'} SCM Repository
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? 'Edit SCM Repository' : 'Create SCM Repository'}
      description={
        isEditPage ? (
          <>You can edit current SCM Repository attributes below.</>
        ) : (
          <>
            You can create an SCM Repository like <label>apache/maven.git</label> or <label>git/twitter4j.git</label>. It can be
            created with either an Internal URL or External URL.
          </>
        )
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="SCM Repository"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
