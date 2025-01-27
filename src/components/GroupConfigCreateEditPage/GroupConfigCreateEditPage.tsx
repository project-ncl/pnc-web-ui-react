import { ActionGroup, Button, Form, FormGroup, TextInput } from '@patternfly/react-core';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GroupConfiguration, Product, ProductVersion } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { groupConfigEntityAttributes } from 'common/groupConfigEntityAttributes';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as groupConfigApi from 'services/groupConfigApi';
import * as productApi from 'services/productApi';
import * as productVersionApi from 'services/productVersionApi';

import { maxLengthValidator } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IGroupConfigCreateEditPageProps {
  isEditPage?: boolean;
}

const fieldConfigs = {
  name: {
    isRequired: true,
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

export const GroupConfigCreateEditPage = ({ isEditPage = false }: IGroupConfigCreateEditPageProps) => {
  const { groupConfigId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(groupConfigApi.createGroupConfig);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(groupConfigApi.getGroupConfig);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(groupConfigApi.patchGroupConfig);

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedProductVersion, setSelectedProductVersion] = useState<ProductVersion>();

  const productVersionRegisterObject = register<string>(groupConfigEntityAttributes.productVersion.id);

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Group Config',
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage.run({
      serviceData: {
        data: {
          name: data.name,
          productVersion: selectedProductVersion ? ({ id: selectedProductVersion.id } as ProductVersion) : null,
        } as GroupConfiguration,
      },
      onSuccess: (result) => {
        const newGroupConfigId = result.response.data.id;
        if (!newGroupConfigId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid groupConfigId coming from Orch POST response: ${newGroupConfigId}`,
          });
        }

        navigate(`/group-configs/${newGroupConfigId}`);
      },
      onError: () => console.error('Failed to create Group Config.'),
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const newData = {
      name: data.name,
      productVersion: selectedProductVersion ? ({ id: selectedProductVersion.id } as ProductVersion) : null,
    } as GroupConfiguration;

    const patchData = createSafePatch(serviceContainerEditPageGet.data!, newData);

    return serviceContainerEditPagePatch.run({
      serviceData: { id: groupConfigId, patchData },
      onSuccess: () => navigate(`/group-configs/${groupConfigId}`),
      onError: () => console.error('Failed to edit Group Config.'),
    });
  };

  const fetchProductVersions = useCallback(
    (requestConfig: AxiosRequestConfig = {}) => {
      return selectedProduct ? productApi.getProductVersions({ id: selectedProduct.id }, requestConfig) : Promise.resolve([]);
    },
    [selectedProduct]
  );

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: groupConfigId },
        onSuccess: (result) => {
          const groupConfig: GroupConfiguration = result.response.data;

          if (groupConfig.productVersion) {
            setFieldValues({ name: groupConfig.name });
            serviceContainerProductVersionRunner({
              serviceData: { id: groupConfig.productVersion.id },
              onSuccess: (result) => {
                const productVersion: ProductVersion = result.response.data;

                setSelectedProductVersion(productVersion);
                setSelectedProduct(productVersion.product);

                setFieldValues({ name: groupConfig.name, productVersion: productVersion.version });
              },
            });
          } else {
            setFieldValues({ name: groupConfig.name });
          }
        },
      });
    }
  }, [isEditPage, groupConfigId, setFieldValues, serviceContainerEditPageGetRunner, serviceContainerProductVersionRunner]);

  const productSearchSelect = (
    <SearchSelect
      selectedItem={selectedProduct?.name}
      onSelect={(event, _, product: Product) => {
        setSelectedProduct(product);
        productVersionRegisterObject.onChange(event, '');
        setSelectedProductVersion(undefined);
      }}
      onClear={(event) => {
        setSelectedProduct(undefined);
        productVersionRegisterObject.onChange(event, '');
        setSelectedProductVersion(undefined);
      }}
      fetchCallback={productApi.getProducts}
      titleAttribute="name"
      placeholderText="Select Product"
    />
  );

  const productVersionSearchSelect = (
    <FormInput<string>
      {...productVersionRegisterObject}
      render={({ value, validated, onChange }) => (
        <SearchSelect
          selectedItem={value}
          validated={validated}
          onSelect={(event, _, productVersion: ProductVersion) => {
            onChange(event, productVersion.version);
            setSelectedProductVersion(productVersion);
          }}
          onClear={(event) => {
            onChange(event, '');
            setSelectedProductVersion(undefined);
          }}
          fetchCallback={fetchProductVersions}
          titleAttribute="version"
          placeholderText="Select Version"
          isDisabled={!selectedProduct}
        />
      )}
    />
  );

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup isRequired label={groupConfigEntityAttributes.name.title} fieldId={groupConfigEntityAttributes.name.id}>
          <TextInput
            isRequired
            type="text"
            id={groupConfigEntityAttributes.name.id}
            name={groupConfigEntityAttributes.name.id}
            autoComplete="off"
            {...register<string>(groupConfigEntityAttributes.name.id, fieldConfigs.name)}
          />
          <FormInputHelperText variant="error">{getFieldErrors(groupConfigEntityAttributes.name.id)}</FormInputHelperText>
        </FormGroup>

        <FormGroup label={`Product ${productEntityAttributes.name.title}`} fieldId={productEntityAttributes.name.id}>
          {serviceContainerEditPageGet.data?.productVersion ? (
            <ServiceContainerLoading
              {...serviceContainerProductVersion}
              variant="inline"
              title={`Product ${productEntityAttributes.name.title}`}
            >
              {productSearchSelect}
            </ServiceContainerLoading>
          ) : (
            productSearchSelect
          )}
        </FormGroup>

        <FormGroup
          isRequired={!!selectedProduct}
          label={groupConfigEntityAttributes.productVersion.title}
          fieldId={groupConfigEntityAttributes.productVersion.id}
        >
          {serviceContainerEditPageGet.data?.productVersion ? (
            <ServiceContainerLoading
              {...serviceContainerProductVersion}
              variant="inline"
              title={groupConfigEntityAttributes.productVersion.title}
            >
              {productVersionSearchSelect}
            </ServiceContainerLoading>
          ) : (
            productVersionSearchSelect
          )}
          <FormInputHelperText variant="error" isHidden={!selectedProduct || !!selectedProductVersion}>
            Field must be filled.
          </FormInputHelperText>
        </FormGroup>

        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled || (selectedProduct && !selectedProductVersion)}
            onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}
          >
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.groupConfig}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.groupConfigEdit : PageTitles.groupConfigCreate}
      breadcrumbs={
        isEditPage
          ? [
              { entity: breadcrumbData.groupConfig.id, title: serviceContainerEditPageGet.data?.name, url: '-/edit' },
              { entity: breadcrumbData.edit.id, title: PageTitles.groupConfigEdit, custom: true },
            ]
          : [{ entity: breadcrumbData.create.id, title: PageTitles.groupConfigCreate }]
      }
      description={
        isEditPage ? (
          <>You can edit current Group Config attributes below.</>
        ) : (
          <>You can create a Group Config with its Product Version here.</>
        )
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Group Config"
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
  );
};
