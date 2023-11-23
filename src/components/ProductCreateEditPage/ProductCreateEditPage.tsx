import { ActionGroup, Button, Form, FormGroup, FormHelperText, Label, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Product } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as productApi from 'services/productApi';

import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const fieldConfigs = {
  name: {
    isRequired: true,
  },
  abbreviation: {
    isRequired: true,
  },
} satisfies IFieldConfigs;

interface IProductCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProductCreateEditPage = ({ isEditPage = false }: IProductCreateEditPageProps) => {
  const { productId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(productApi.createProduct);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(productApi.getProduct);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(productApi.patchProduct);

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: { data: data as Product },
      })
      .then((response) => {
        const newProductId = response?.data?.id;
        if (!newProductId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid productId coming from Orch POST response: ${newProductId}`,
          });
        }
        navigate(`/products/${newProductId}`);
      })
      .catch((error) => {
        console.error('Failed to create Product.');
        throw error;
      });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, data);

    return serviceContainerEditPagePatch
      .run({ serviceData: { id: productId, patchData } })
      .then(() => {
        navigate(`/products/${productId}`);
      })
      .catch((error) => {
        console.error('Failed to edit Product.');
        throw error;
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: productId } }).then((response) => {
        setFieldValues(response.data);
      });
    }
  }, [isEditPage, productId, serviceContainerEditPageGetRunner, setFieldValues]);

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={productEntityAttributes.name.title}
          fieldId={productEntityAttributes.name.id}
          helperText={
            <FormHelperText isHidden={getFieldState(productEntityAttributes.name.id) !== 'error'} isError>
              {getFieldErrors(productEntityAttributes.name.id)}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            type="text"
            id={productEntityAttributes.name.id}
            name={productEntityAttributes.name.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.name.id, fieldConfigs.name)}
          />
        </FormGroup>
        <FormGroup
          isRequired
          label={productEntityAttributes.abbreviation.title}
          fieldId={productEntityAttributes.abbreviation.id}
          helperText={
            <FormHelperText isHidden={getFieldState(productEntityAttributes.abbreviation.id) !== 'error'} isError>
              {getFieldErrors(productEntityAttributes.abbreviation.id)}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            type="text"
            id={productEntityAttributes.abbreviation.id}
            name={productEntityAttributes.abbreviation.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.abbreviation.id, fieldConfigs.abbreviation)}
          />
        </FormGroup>
        <FormGroup label={productEntityAttributes.description.title} fieldId={productEntityAttributes.description.id}>
          <TextArea
            id={productEntityAttributes.description.id}
            name={productEntityAttributes.description.id}
            autoResize
            resizeOrientation="vertical"
            {...register<string>(productEntityAttributes.description.id)}
          />
        </FormGroup>
        <FormGroup label={productEntityAttributes.productManagers.title} fieldId={productEntityAttributes.productManagers.id}>
          <TextInput
            type="text"
            id={productEntityAttributes.productManagers.id}
            name={productEntityAttributes.productManagers.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.productManagers.id)}
          />
        </FormGroup>
        <FormGroup label={productEntityAttributes.productPagesCode.title} fieldId={productEntityAttributes.productPagesCode.id}>
          <TextInput
            type="text"
            id={productEntityAttributes.productPagesCode.id}
            name={productEntityAttributes.productPagesCode.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.productPagesCode.id)}
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}>
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.product}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.productEdit : PageTitles.productCreate}
      description={
        isEditPage ? (
          <>You can edit current Product attributes below.</>
        ) : (
          <>
            You can create a product like <Label>EAP</Label>. Usually, Product is a deliverable package composed of multiple
            Projects like <Label>JBoss Modules</Label> or <Label>Hibernate</Label>.
          </>
        )
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Product"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
