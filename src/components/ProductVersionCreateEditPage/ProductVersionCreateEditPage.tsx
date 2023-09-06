import { ActionGroup, Button, Form, FormGroup, FormHelperText, TextInput } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageTitles } from 'common/constants';
import { productVersionEntityAttributes } from 'common/productVersionEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as productVersionApi from 'services/productVersionApi';

import { validateProductVersionName } from 'utils/formValidationHelpers';
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
    ],
  },
  'attributes.brewTagPrefix': {
    isRequired: true,
  },
} satisfies IFieldConfigs;

interface IProductVersionCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProductVersionCreateEditPage = ({ isEditPage = false }: IProductVersionCreateEditPageProps) => {
  const { productId } = useParams();
  const { productVersionId } = useParams();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(productVersionApi.createProductVersion);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(productVersionApi.patchProductVersion);

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: `${serviceContainerEditPageGet.data?.version} ${PageTitles.delimiterSymbol} ${serviceContainerEditPageGet.data?.product.name}`,
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: { data: { ...data, product: { id: productId } } },
      })
      .then((response: any) => {
        const newProductVersionId = response?.data?.id;
        if (!newProductVersionId) {
          throw new Error(`Invalid newProductVersionId coming from Orch POST response: ${newProductVersionId}`);
        }
        navigate(`../${newProductVersionId}`);
      })
      .catch((e: any) => {
        throw new Error('Failed to create Product Version.');
      });
  };

  const submitUpdate = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, {
      version: data.version,
      attributes: { BREW_TAG_PREFIX: data['attributes.brewTagPrefix'] },
    });

    serviceContainerEditPagePatch
      .run({ serviceData: { id: productVersionId, patchData } })
      .then(() => {
        navigate(`..`);
      })
      .catch(() => {
        throw new Error('Failed to edit Product Version.');
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: productVersionId } }).then((response: any) => {
        setFieldValues({
          version: response.data?.version,
          'attributes.brewTagPrefix': response.data?.attributes?.BREW_TAG_PREFIX,
        });
      });
    }
  }, [isEditPage, productVersionId, serviceContainerEditPageGetRunner, setFieldValues]);

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
          helperText={
            <FormHelperText isHidden={getFieldState(productVersionEntityAttributes.version.id) !== 'error'} isError>
              {getFieldErrors(productVersionEntityAttributes.version.id)}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            type="text"
            id={productVersionEntityAttributes.version.id}
            name={productVersionEntityAttributes.version.id}
            autoComplete="off"
            {...register<string>(productVersionEntityAttributes.version.id, fieldConfigs.version)}
          />
        </FormGroup>
        {isEditPage && (
          <FormGroup
            isRequired
            label={productVersionEntityAttributes['attributes.brewTagPrefix'].title}
            fieldId={productVersionEntityAttributes['attributes.brewTagPrefix'].id}
            helperText={
              <FormHelperText
                isHidden={getFieldState(productVersionEntityAttributes['attributes.brewTagPrefix'].id) !== 'error'}
                isError
              >
                {getFieldErrors(productVersionEntityAttributes['attributes.brewTagPrefix'].id)}
              </FormHelperText>
            }
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
          </FormGroup>
        )}
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled}
            onClick={handleSubmit(isEditPage ? submitUpdate : submitCreate)}
          >
            {isEditPage ? 'Update' : 'Create'} Product Version
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? 'Update Product Version' : 'Create Product Version'}
      description={
        isEditPage ? <>You can update current Product Version attributes below.</> : <>You can create a new Product Version.</>
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Product Version"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
