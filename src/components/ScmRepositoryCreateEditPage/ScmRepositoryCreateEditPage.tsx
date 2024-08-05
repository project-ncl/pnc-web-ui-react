import { ActionGroup, Button, Form, FormGroup, Label, Popover, Switch } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { SCMRepository, SCMRepositoryPage } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';
import { RepositoryCreationResponseCustomized } from 'common/types';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasScmRepositoryFailed, hasScmRepositorySucceeded, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ScmRepositoryUrlAlert } from 'components/ScmRepositoryUrlAlert/ScmRepositoryUrlAlert';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TextInputFindMatch } from 'components/TextInputFindMatch/TextInputFindMatch';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const validatePreBuildSync = (fieldValues: IFieldValues): boolean => {
  return fieldValues.externalUrl || !fieldValues.preBuildSyncEnabled;
};

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
    validators: [
      { validator: validateScmUrl, errorMessage: 'Invalid SCM URL format.' },
      {
        validator: validatePreBuildSync,
        errorMessage: 'External SCM URL cannot be empty when Pre-build Sync is enabled.',
        relatedFields: ['preBuildSyncEnabled'],
      },
    ],
  },
  preBuildSyncEnabled: {
    validators: [
      {
        validator: validatePreBuildSync,
        errorMessage: 'Pre-build Sync cannot be enabled when there is no External SCM URL.',
        relatedFields: ['externalUrl'],
      },
    ],
  },
} satisfies IFieldConfigs;

interface IScmRepositoryCreateEditPageProps {
  isEditPage?: boolean;
}

export const ScmRepositoryCreateEditPage = ({ isEditPage = false }: IScmRepositoryCreateEditPageProps) => {
  const { scmRepositoryId } = useParamsRequired();
  const navigate = useNavigate();

  const [scmCreatingLoading, setScmCreatingLoading] = useState<boolean>(false);
  const [scmCreatingFinished, setScmCreatingFinished] = useState<SCMRepository>();
  const [scmCreatingError, setScmCreatingError] = useState<string>();

  const [selectedScmRepository, setSelectedScmRepository] = useState<SCMRepository>();

  // create page
  const serviceContainerCreatePage = useServiceContainer(scmRepositoryApi.createScmRepository);
  const serviceContainerCreatePageTaskId = serviceContainerCreatePage.data?.taskId;

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(scmRepositoryApi.patchScmRepository);

  const serviceContainerScmRepositories = useServiceContainer(scmRepositoryApi.getScmRepositoriesFiltered, 0);

  const {
    register,
    setFieldValues,
    getFieldValue,
    getFieldState,
    getFieldErrors,
    handleSubmit,
    isSubmitDisabled,
    hasFormChanged,
  } = useForm();

  const scmRepositoryEntityAttributesUrl = useMemo(
    () => (isEditPage ? scmRepositoryEntityAttributes.externalUrl : scmRepositoryEntityAttributes.scmUrl),
    [isEditPage]
  );

  const hasScmUrlChanged = useMemo(
    () => getFieldValue(scmRepositoryEntityAttributesUrl.id) !== serviceContainerEditPageGet.data?.externalUrl,
    [getFieldValue, scmRepositoryEntityAttributesUrl.id, serviceContainerEditPageGet.data]
  );

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      entityName:
        (serviceContainerEditPageGet.data && generateScmRepositoryName({ scmRepository: serviceContainerEditPageGet.data })) ||
        undefined,
      firstLevelEntity: 'SCM Repository',
    })
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasScmRepositoryFailed(wsData, { taskId: serviceContainerCreatePageTaskId })) {
          setScmCreatingError(wsData.notificationType);
          setScmCreatingFinished(undefined);
          setScmCreatingLoading(false);
        } else if (hasScmRepositorySucceeded(wsData, { taskId: serviceContainerCreatePageTaskId })) {
          const scmRepository: SCMRepository = wsData.scmRepository;

          setScmCreatingError(undefined);
          setScmCreatingFinished(scmRepository);
          setScmCreatingLoading(false);
        }
      },
      [serviceContainerCreatePageTaskId]
    ),
    {
      preventListening: !serviceContainerCreatePageTaskId,
    }
  );

  const submitCreate = (data: IFieldValues) => {
    setScmCreatingLoading(true);

    // reset previous results
    setScmCreatingError(undefined);
    setScmCreatingFinished(undefined);

    return serviceContainerCreatePage.run({
      serviceData: { data: data as SCMRepository },
      onError: (error) => {
        setScmCreatingLoading(false);
        setScmCreatingError(error.errorMessage);
      },
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, data);

    return serviceContainerEditPagePatch.run({
      serviceData: { id: scmRepositoryId, patchData },
      onSuccess: () => {
        navigate(`/scm-repositories/${scmRepositoryId}`);
      },
    });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: scmRepositoryId },
        onSuccess: (result) => setFieldValues(result.response.data),
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
        {isEditPage && (
          <FormGroup
            label={scmRepositoryEntityAttributes.internalUrl.title}
            fieldId={scmRepositoryEntityAttributes.internalUrl.id}
            labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.internalUrl.tooltip} />}
          >
            {serviceContainerEditPageGet.data && <ScmRepositoryUrl internalScmRepository={serviceContainerEditPageGet.data} />}
          </FormGroup>
        )}

        <FormGroup
          isRequired={!isEditPage}
          label={scmRepositoryEntityAttributesUrl.title}
          fieldId={scmRepositoryEntityAttributesUrl.id}
          labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributesUrl.tooltip} />}
        >
          <FormInput
            {...register<string>(
              scmRepositoryEntityAttributesUrl.id,
              isEditPage ? editFieldConfigs.externalUrl : createFieldConfigs.scmUrl
            )}
            render={(registerData) => (
              <TextInputFindMatch
                isRequired={!isEditPage}
                type="text"
                id={scmRepositoryEntityAttributesUrl.id}
                name={scmRepositoryEntityAttributesUrl.id}
                autoComplete="off"
                validator={(value) => !!value && validateScmUrl(value)}
                fetchCallback={(value) => serviceContainerScmRepositories.run({ serviceData: { matchUrl: value } })}
                onMatch={(scmRepositories: SCMRepositoryPage) => setSelectedScmRepository(scmRepositories.content?.[0])}
                onNoMatch={() => setSelectedScmRepository(undefined)}
                {...registerData}
              />
            )}
          />
          <FormInputHelperText variant="error">{getFieldErrors(scmRepositoryEntityAttributesUrl.id)}</FormInputHelperText>
        </FormGroup>

        <FormGroup
          label={scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
          fieldId={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
          labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip} />}
        >
          <Popover
            position="right"
            bodyContent={<div>Recommended to be enabled when external repository is linked.</div>}
            isVisible={
              !getFieldValue(scmRepositoryEntityAttributes.preBuildSyncEnabled.id) &&
              (!isEditPage || !!getFieldValue(scmRepositoryEntityAttributes.externalUrl.id))
            }
            shouldClose={(_, hideFunction) => hideFunction?.()}
          >
            <FormInput<boolean>
              {...register<boolean>(
                scmRepositoryEntityAttributes.preBuildSyncEnabled.id,
                isEditPage ? editFieldConfigs.preBuildSyncEnabled : createFieldConfigs.preBuildSyncEnabled
              )}
              render={({ value, onChange, onBlur }) => (
                <Switch
                  id={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                  name={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                  label="Enabled"
                  labelOff="Disabled"
                  isChecked={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Popover>
          <FormInputHelperText variant="error">
            {getFieldErrors(scmRepositoryEntityAttributes.preBuildSyncEnabled.id)}
          </FormInputHelperText>
        </FormGroup>

        {getFieldState(scmRepositoryEntityAttributesUrl.id) === 'success' && (
          <ServiceContainerLoading
            title="SCM Repository"
            emptyContent={<ScmRepositoryUrlAlert variant="not-synced" {...selectedScmRepository} />}
            {...serviceContainerScmRepositories}
          >
            <ScmRepositoryUrlAlert
              variant="synced"
              alertLevel={hasScmUrlChanged ? 'danger' : 'info'}
              {...selectedScmRepository}
            />
          </ServiceContainerLoading>
        )}

        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={
              isSubmitDisabled ||
              !hasFormChanged ||
              (hasScmUrlChanged && (serviceContainerScmRepositories.loading || !!selectedScmRepository))
            }
            onClick={handleSubmit<SCMRepository, SCMRepository | RepositoryCreationResponseCustomized>(
              isEditPage ? submitEdit : submitCreate
            )}
          >
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.scmRepository}
          </Button>
          {scmCreatingFinished?.id && (
            <Button
              variant="secondary"
              component={(props) => <Link {...props} to={`/scm-repositories/${scmCreatingFinished.id}`} />}
            >
              <CheckIcon /> {ButtonTitles.view} {EntityTitles.scmRepository}
            </Button>
          )}
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.scmRepositoryEdit : PageTitles.scmRepositoryCreate}
      breadcrumbs={
        isEditPage
          ? [
              {
                entity: breadcrumbData.scmRepository.id,
                title: generateScmRepositoryName({ scmRepository: serviceContainerEditPageGet.data! }),
                url: '-/edit',
              },
              { entity: breadcrumbData.edit.id, title: PageTitles.scmRepositoryEdit, custom: true },
            ]
          : [{ entity: breadcrumbData.create.id, title: PageTitles.scmRepositoryCreate }]
      }
      description={
        isEditPage ? (
          <>You can edit current SCM Repository attributes below.</>
        ) : (
          <>
            You can manually create SCM Repository, for example <Label>apache/maven.git</Label> or{' '}
            <Label>git/twitter4j.git</Label> here. SCM Repository can be created with either an Internal URL or External URL.
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
        <ServiceContainerCreatingUpdating data={scmCreatingFinished} loading={scmCreatingLoading} error={scmCreatingError || ''}>
          {formComponent}
        </ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
