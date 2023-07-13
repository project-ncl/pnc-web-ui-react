import {
  ActionGroup,
  Button,
  Flex,
  FlexItem,
  FlexProps,
  Form,
  FormGroup,
  FormHelperText,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SCMRepository } from 'pnc-api-types-ts';

import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IFields, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch, transformFormToValues } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IScmRepositoryCreateEditPageProps {
  isEditPage?: boolean;
}

const createFormConfig = {
  scmUrl: {
    isRequired: true,
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid SCM URL format.' }],
  },
  preBuildSyncEnabled: {
    value: true,
  },
};

const editFormConfig = {
  externalUrl: {
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid SCM URL format.' }],
  },
  preBuildSyncEnabled: {},
};

const flexDirectionColumn: FlexProps['direction'] = { default: 'column' };

export const ScmRepositoryCreateEditPage = ({ isEditPage = false }: IScmRepositoryCreateEditPageProps) => {
  const [id, setId] = useState<string>();
  const [scmRepository, setScmRepository] = useState<SCMRepository>();
  const navigate = useNavigate();
  const urlPathParams = useParams();

  // create page
  const serviceContainerCreatePage = useServiceContainer(scmRepositoryApi.createScmRepository);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(scmRepositoryApi.getScmRepository);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(scmRepositoryApi.patchScmRepository);

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      entityName: generateScmRepositoryName({ scmRepository: serviceContainerEditPageGet.data }),
      firstLevelEntity: 'SCM Repository',
    })
  );

  const submitCreate = (data: IFields) => {
    return serviceContainerCreatePage
      .run({
        serviceData: {
          data: {
            scmUrl: data.scmUrl.value,
            preBuildSyncEnabled: data.preBuildSyncEnabled.value,
          },
        },
      })
      .then((response: any) => {
        // @Todo: Verify the create result from the WS Message after WS was implemented, see NCL-7935.
        // navigate(`/scm-repositories/${scmRepositoryId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create SCM Repository.');
      });
  };

  const submitUpdate = (data: IFields) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, transformFormToValues(data));

    serviceContainerEditPagePatch
      .run({ serviceData: { id, patchData } })
      .then(() => {
        navigate(`/scm-repositories/${id}`);
      })
      .catch(() => {
        throw new Error('Failed to edit SCM Repository.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    isEditPage ? editFormConfig : createFormConfig,
    isEditPage ? submitUpdate : submitCreate
  );

  useEffect(() => {
    if (isEditPage) {
      if (urlPathParams.scmRepositoryId) {
        serviceContainerEditPageGetRunner({ serviceData: { id: urlPathParams.scmRepositoryId } }).then((response: any) => {
          const scmRepository: SCMRepository = response.data;

          setScmRepository(scmRepository);
          setId(scmRepository.id);
          reinitialize({
            externalUrl: scmRepository.externalUrl,
            preBuildSyncEnabled: scmRepository.preBuildSyncEnabled,
          });
        });
      } else {
        throw new Error(`Invalid scmRepositoryId: ${urlPathParams.scmRepositoryId}`);
      }
    }
  }, [isEditPage, urlPathParams.scmRepositoryId, serviceContainerEditPageGetRunner, reinitialize]);

  const formComponent = (
    <ContentBox padding>
      <div className="w-70">
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
                <FormHelperText isHidden={fields.scmUrl.state !== 'error'} isError>
                  {fields.scmUrl.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={fields.scmUrl.state}
                type="text"
                id={scmRepositoryEntityAttributes.scmUrl.id}
                name={scmRepositoryEntityAttributes.scmUrl.id}
                value={fields.scmUrl.value as string}
                autoComplete="off"
                onChange={(scmUrl) => {
                  onChange('scmUrl', scmUrl);
                }}
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
                {scmRepository && <ScmRepositoryUrl internalScmRepository={scmRepository} />}
              </FormGroup>
              <FormGroup
                label={scmRepositoryEntityAttributes.externalUrl.title}
                fieldId={scmRepositoryEntityAttributes.externalUrl.id}
                labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.externalUrl.tooltip} />}
                helperText={
                  <FormHelperText isHidden={fields.externalUrl.state !== 'error'} isError>
                    {fields.externalUrl.errorMessages?.join(' ')}
                  </FormHelperText>
                }
              >
                <TextInput
                  isRequired
                  validated={fields.externalUrl.state}
                  type="text"
                  id={scmRepositoryEntityAttributes.externalUrl.id}
                  name={scmRepositoryEntityAttributes.externalUrl.id}
                  value={fields.externalUrl.value as string}
                  autoComplete="off"
                  onChange={(externalUrl) => {
                    onChange('externalUrl', externalUrl);
                  }}
                />
              </FormGroup>
            </>
          )}
          <FormGroup
            label={scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
            fieldId={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
            labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip} />}
            helperText={
              <FormHelperText isHidden={fields.preBuildSyncEnabled.state !== 'error'} isError>
                {fields.preBuildSyncEnabled.errorMessages?.join(' ')}
              </FormHelperText>
            }
          >
            <Switch
              id={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
              name={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
              label="Pre-build Sync Enabled"
              labelOff="Pre-build Sync Disabled"
              isChecked={fields.preBuildSyncEnabled?.value as boolean}
              onChange={(preBuildSyncEnabled) => {
                onChange('preBuildSyncEnabled', preBuildSyncEnabled);
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
              {isEditPage ? 'Update' : 'Create'} SCM Repository
            </Button>
          </ActionGroup>
        </Form>
      </div>
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
      <Flex direction={flexDirectionColumn}>
        <FlexItem>
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
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
