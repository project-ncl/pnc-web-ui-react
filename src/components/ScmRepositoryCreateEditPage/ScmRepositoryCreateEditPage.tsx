import {
  ActionGroup,
  Button,
  Flex,
  FlexItem,
  FlexProps,
  Form,
  FormGroup,
  FormHelperText,
  TextInput,
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SCMRepository } from 'pnc-api-types-ts';

import { IFields, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ScmRepositoryUrl } from 'components/ScmRepositoryUrl/ScmRepositoryUrl';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { generateScmRepositoryName } from 'utils/entityNameGenerators';
import { validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch, transformFormToValues } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IScmRepositoryCreateEditPageProps {
  isEditPage?: boolean;
}

const formConfig = {
  scmUrl: {
    isRequired: true,
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid URL format.' }],
  },
  externalUrl: {
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid URL format.' }],
  },
  // preBuildSyncEnabled: {},
};

export const ScmRepositoryCreateEditPage = ({ isEditPage = false }: IScmRepositoryCreateEditPageProps) => {
  const flexDirection: FlexProps['direction'] = { default: 'column' };

  const [id, setId] = useState<string>();
  const [scmRepository, setScmRepository] = useState<SCMRepository>();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
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
            // preBuildSyncEnabled: data.preBuildSyncEnabled.value,
          },
        },
      })
      .then((response: any) => {
        // @Todo: Verify the create result from the WS Message after WS was implemented.
        // navigate(`/scm-repositories/${scmRepositoryId}`);
      })
      .catch((e: any) => {
        setIsSubmitLoading(false);
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
        setIsSubmitLoading(false);
        throw new Error('Failed to edit SCM Repository.');
      });
  };

  const { fields, onChange, reinitialize, onSubmit, isSubmitDisabled } = useForm(
    formConfig,
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
            internalUrl: scmRepository.internalUrl,
            externalUrl: scmRepository.externalUrl,
            // preBuildSyncEnabled: scmRepository.preBuildSyncEnabled,
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
              label="SCM Repository URL"
              fieldId="scmUrl"
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
                id="scmUrl"
                name="scmUrl"
                value={fields.scmUrl.value}
                autoComplete="off"
                onChange={(scmUrl) => {
                  onChange('scmUrl', scmUrl);
                }}
              />
            </FormGroup>
          )}
          {isEditPage && (
            <>
              <FormGroup label="Internal SCM URL" fieldId="internalUrl">
                <ScmRepositoryUrl internalScmRepository={scmRepository} />
              </FormGroup>
              <FormGroup label="External SCM URL" fieldId="externalUrl">
                <TextInput
                  isRequired
                  validated={fields.externalUrl.state}
                  type="text"
                  id="externalUrl"
                  name="externalUrl"
                  value={fields.externalUrl.value}
                  autoComplete="off"
                  onChange={(externalUrl) => {
                    onChange('externalUrl', externalUrl);
                  }}
                />
              </FormGroup>
            </>
          )}
          {/* <FormGroup
            label="Pre-build Sync"
            fieldId="preBuildSyncEnabled"
            helperText={
              <FormHelperText isHidden={fields.preBuildSyncEnabled.state !== 'error'} isError>
                {fields.preBuildSyncEnabled.errorMessages?.join(' ')}
              </FormHelperText>
            }
          >
            <Switch
              id="preBuildSyncEnabled"
              name="preBuildSyncEnabled"
              isChecked={fields.preBuildSyncEnabled.value?.toLowerCase() === 'true'}
              onChange={(preBuildSyncEnabled) => {
                onChange('preBuildSyncEnabled', preBuildSyncEnabled);
              }}
            />
          </FormGroup> */}
          <ActionGroup>
            <Button
              variant="primary"
              isDisabled={isSubmitDisabled}
              isLoading={isSubmitLoading}
              onClick={() => {
                setIsSubmitLoading(true);
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
      title={isEditPage ? 'Update SCM Repository' : 'Create SCM Repository'}
      description={
        isEditPage ? (
          <>You can update current SCM Repository attributes below.</>
        ) : (
          <>You can create a SCM Repository with either a Internal URL(from Gerrit) or External URL(from any other SCM system).</>
        )
      }
    >
      <Flex direction={flexDirection}>
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
