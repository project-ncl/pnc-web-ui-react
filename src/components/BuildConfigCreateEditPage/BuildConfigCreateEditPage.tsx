import { ActionGroup, Button, Form } from '@patternfly/react-core';
import { useEffect } from 'react';

import { PageTitles } from 'common/constants';

import { IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as buildConfigApi from 'services/buildConfigApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IBuildConfigCreateEditPageProps {
  isEditPage?: boolean;
}

export const BuildConfigCreateEditPage = ({ isEditPage = false }: IBuildConfigCreateEditPageProps) => {
  const { buildConfigId } = useParamsRequired();

  // create page
  const serviceContainerCreatePage = useServiceContainer(buildConfigApi.createBuildConfig);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(buildConfigApi.patchBuildConfig);

  const useFormObject = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Build Config',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return Promise.resolve();
  };

  const submitEdit = (data: IFieldValues) => {
    return Promise.resolve();
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: buildConfigId } });
    }
  }, [isEditPage, buildConfigId, serviceContainerEditPageGetRunner]);

  const formComponent = (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={useFormObject.isSubmitDisabled}
            onClick={useFormObject.handleSubmit(isEditPage ? submitEdit : submitCreate)}
          >
            {isEditPage ? PageTitles.buildConfigEdit : PageTitles.buildConfigCreate}
          </Button>
        </ActionGroup>
      </Form>
    </>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.buildConfigEdit : PageTitles.buildConfigCreate}
      description={
        isEditPage ? <>You can update current Build Config attributes below.</> : <>You can create a new Build Config.</>
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Build Config"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
