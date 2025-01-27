import { ActionGroup, Button, Form, FormGroup, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductVersion } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productVersionEntityAttributes } from 'common/productVersionEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as productApi from 'services/productApi';
import * as productVersionApi from 'services/productVersionApi';

import { maxLengthValidator, validateProductVersionName } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

const fieldConfigs = {
  version: {
    isRequired: true,
    validators: [
      {
        validator: validateProductVersionName,
        errorMessage: 'The version should consist of two numeric parts separated by a dot (e.g. 1.0).',
      },
      maxLengthValidator(50),
    ],
  },
  'attributes.brewTagPrefix': {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

interface IProductVersionCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProductVersionCreateEditPage = ({ isEditPage = false }: IProductVersionCreateEditPageProps) => {
  const { productId, productVersionId } = useParamsRequired();
  const navigate = useNavigate();

  // breadcrumb purposes
  const serviceContainerProduct = useServiceContainer(productApi.getProduct);
  const serviceContainerProductRunner = serviceContainerProduct.run;

  // create page
  const serviceContainerCreatePage = useServiceContainer(productVersionApi.createProductVersion);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(productVersionApi.patchProductVersion);

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: [serviceContainerEditPageGet.data?.version, serviceContainerProduct.data?.name],
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage.run({
      serviceData: { data: { ...data, product: { id: productId } } as ProductVersion },
      onSuccess: (result) => {
        const newProductVersionId = result.response.data.id;
        if (!newProductVersionId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid productVersionId coming from Orch POST response: ${newProductVersionId}`,
          });
        }
        navigate(`../${newProductVersionId}`);
      },
      onError: () => console.error('Failed to create Product Version.'),
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, {
      version: data.version,
      attributes: { BREW_TAG_PREFIX: data['attributes.brewTagPrefix'] },
    });

    return serviceContainerEditPagePatch.run({
      serviceData: { id: productVersionId, patchData },
      onSuccess: () => navigate(`..`),
      onError: () => console.error('Failed to edit Product Version.'),
    });
  };

  useEffect(() => {
    serviceContainerProductRunner({ serviceData: { id: productId } });
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: productVersionId },
        onSuccess: (result) => {
          setFieldValues({
            version: result.response.data.version,
            'attributes.brewTagPrefix': result.response.data.attributes?.BREW_TAG_PREFIX,
          });
        },
      });
    }
  }, [isEditPage, productVersionId, productId, serviceContainerProductRunner, serviceContainerEditPageGetRunner, setFieldValues]);

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={productVersionEntityAttributes.version.title}
          fieldId={productVersionEntityAttributes.version.id}
        >
          <TextInput
            isRequired
            type="text"
            id={productVersionEntityAttributes.version.id}
            name={productVersionEntityAttributes.version.id}
            autoComplete="off"
            {...register<string>(productVersionEntityAttributes.version.id, fieldConfigs.version)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(productVersionEntityAttributes.version.id)}</FormInputHelperText>
        </FormGroup>
        {isEditPage && (
          <FormGroup
            isRequired
            label={productVersionEntityAttributes['attributes.brewTagPrefix'].title}
            fieldId={productVersionEntityAttributes['attributes.brewTagPrefix'].id}
          >
            <TextInput
              isRequired
              type="text"
              id={productVersionEntityAttributes['attributes.brewTagPrefix'].id}
              name={productVersionEntityAttributes['attributes.brewTagPrefix'].id}
              autoComplete="off"
              {...register<string>(
                productVersionEntityAttributes['attributes.brewTagPrefix'].id,
                fieldConfigs['attributes.brewTagPrefix']
              )}
            />
            <FormInputHelperText variant="error">
              {getFieldErrors(productVersionEntityAttributes['attributes.brewTagPrefix'].id)}
            </FormInputHelperText>
          </FormGroup>
        )}
        <ActionGroup>
          <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}>
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.productVersion}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProduct} title={EntityTitles.product}>
      <PageLayout
        title={isEditPage ? PageTitles.productVersionEdit : PageTitles.productVersionCreate}
        description={
          isEditPage ? <>You can edit current Product Version attributes below.</> : <>You can create a new Product Version.</>
        }
        breadcrumbs={
          isEditPage
            ? [
                { entity: breadcrumbData.product.id, title: serviceContainerEditPageGet.data?.product?.name },
                { entity: breadcrumbData.productVersion.id, title: serviceContainerEditPageGet.data?.version, url: '-/edit' },
                { entity: breadcrumbData.edit.id, title: PageTitles.productVersionEdit, custom: true },
              ]
            : [
                { entity: breadcrumbData.product.id, title: serviceContainerProduct.data?.name },
                { entity: breadcrumbData.create.id, title: PageTitles.productVersionCreate },
              ]
        }
      >
        {isEditPage ? (
          <ServiceContainerCreatingUpdating
            {...serviceContainerEditPagePatch}
            serviceContainerLoading={serviceContainerEditPageGet}
            title="Product Version"
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
    </ServiceContainerLoading>
  );
};
