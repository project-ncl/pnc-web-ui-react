import { ActionGroup, Button, Form, FormGroup, Label, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Product } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as productApi from 'services/productApi';

import { maxLengthValidator, regexValidator } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const fieldConfigs = {
  name: {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
  abbreviation: {
    isRequired: true,
    validators: [maxLengthValidator(20), regexValidator(/^[a-zA-Z0-9-]+$/)],
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

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage.run({
      serviceData: { data: data as Product },
      onSuccess: (result) => {
        const newProductId = result.response.data.id;
        if (!newProductId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid productId coming from Orch POST response: ${newProductId}`,
          });
        }
        navigate(`/products/${newProductId}`);
      },
      onError: () => console.error('Failed to create Product.'),
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, data);

    return serviceContainerEditPagePatch.run({
      serviceData: { id: productId, patchData },
      onSuccess: () => navigate(`/products/${productId}`),
      onError: () => console.error('Failed to edit Product.'),
    });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: productId },
        onSuccess: (result) => setFieldValues(result.response.data),
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
        <FormGroup isRequired label={productEntityAttributes.name.title} fieldId={productEntityAttributes.name.id}>
          <TextInput
            isRequired
            type="text"
            id={productEntityAttributes.name.id}
            name={productEntityAttributes.name.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.name.id, fieldConfigs.name)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(productEntityAttributes.name.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup
          isRequired
          label={productEntityAttributes.abbreviation.title}
          fieldId={productEntityAttributes.abbreviation.id}
        >
          <TextInput
            isRequired
            type="text"
            id={productEntityAttributes.abbreviation.id}
            name={productEntityAttributes.abbreviation.id}
            autoComplete="off"
            {...register<string>(productEntityAttributes.abbreviation.id, fieldConfigs.abbreviation)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(productEntityAttributes.abbreviation.id)}</FormInputHelperText>
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
      breadcrumbs={
        isEditPage
          ? [
              { entity: breadcrumbData.product.id, title: serviceContainerEditPageGet.data?.name, url: '-/edit' },
              { entity: breadcrumbData.edit.id, title: PageTitles.productEdit, custom: true },
            ]
          : [{ entity: breadcrumbData.create.id, title: PageTitles.productCreate }]
      }
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
