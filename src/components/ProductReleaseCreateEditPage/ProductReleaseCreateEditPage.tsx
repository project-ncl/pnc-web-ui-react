import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { Select, SelectOption } from '@patternfly/react-core/deprecated';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductMilestone, ProductMilestoneRef, ProductRelease, ProductVersionRef } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productReleaseApi from 'services/productReleaseApi';
import * as productVersionApi from 'services/productVersionApi';

import { maxLengthValidator, validateDate, validateProductReleaseName } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime, getProductVersionSuffix, parseDate } from 'utils/utils';

const fieldConfigs = {
  version: {
    isRequired: true,
    validators: [
      {
        validator: validateProductReleaseName,
        errorMessage:
          'The version consists of two parts separated by a dot, first part is numeric, second alphanumeric (e.g 1.GA).',
      },
      maxLengthValidator(255),
    ],
  },
  releaseDate: {
    isRequired: true,
    validators: [{ validator: validateDate, errorMessage: 'Invalid date format.' }],
  },
  supportLevel: {
    isRequired: true,
  },
  productMilestone: {
    isRequired: true,
  },
  productPagesCode: {
    validators: [maxLengthValidator(255)],
  },
  commonPlatformEnumeration: {
    validators: [maxLengthValidator(255)],
  },
} satisfies IFieldConfigs;

interface IProductReleaseCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProductReleaseCreateEditPage = ({ isEditPage = false }: IProductReleaseCreateEditPageProps) => {
  const { productReleaseId } = useParamsRequired();
  const { productVersionId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(productReleaseApi.createProductRelease);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(productReleaseApi.getProductRelease);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(productReleaseApi.patchProductRelease);

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  const [selectedProductMilestone, setSelectedProductMilestone] = useState<ProductMilestone>();

  const fetchProductMilestones = useCallback(
    (requestConfig = {}) => {
      return productVersionApi.getProductMilestones({ id: productVersionId! }, requestConfig);
    },
    [productVersionId]
  );

  const [isSupportLevelSelectOpen, setIsSupportLevelSelectOpen] = useState<boolean>(false);

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
      nestedEntity: 'Release',
      entityName: [serviceContainerEditPageGet.data?.version, serviceContainerProductVersion.data?.product?.name],
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: {
          data: {
            version: serviceContainerProductVersion.data?.version + '.' + data.version,
            releaseDate: parseDate(data.releaseDate),
            supportLevel: data.supportLevel,
            commonPlatformEnumeration: data.commonPlatformEnumeration,
            productPagesCode: data.productPagesCode,
            productVersion: { id: serviceContainerProductVersion.data?.id } as ProductVersionRef,
            productMilestone: { id: selectedProductMilestone!.id } as ProductMilestoneRef,
          } as ProductRelease,
        },
      })
      .then((response: any) => {
        const newProductReleaseId = response?.data?.id;
        if (!newProductReleaseId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid productReleaseId coming from Orch POST response: ${newProductReleaseId}`,
          });
        }

        navigate('..');
      })
      .catch((error: any) => {
        console.error('Failed to create Product Release.');
        throw error;
      });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, {
      version: serviceContainerProductVersion.data?.version + '.' + data.version,
      releaseDate: parseDate(data.releaseDate),
      supportLevel: data.supportLevel,
      commonPlatformEnumeration: data.commonPlatformEnumeration,
      productPagesCode: data.productPagesCode,
    });

    return serviceContainerEditPagePatch
      .run({ serviceData: { id: productReleaseId, patchData } })
      .then(() => {
        navigate('../..');
      })
      .catch((error: any) => {
        console.error('Failed to edit Product Release.');
        throw error;
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: productReleaseId } }).then((response: any) => {
        const productRelease: ProductRelease = response.data;
        const productReleaseVersionShort = getProductVersionSuffix(productRelease);
        const releaseDate = productRelease.releaseDate && createDateTime({ date: productRelease.releaseDate }).date;

        setFieldValues({ ...productRelease, version: productReleaseVersionShort, releaseDate });
      });
    }
  }, [isEditPage, productReleaseId, serviceContainerEditPageGetRunner, setFieldValues]);

  useEffect(() => {
    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [productVersionId, serviceContainerProductVersionRunner]);

  const formComponent = (
    <ContentBox padding isResponsive>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          isRequired
          label={productReleaseEntityAttributes.version.title}
          fieldId={productReleaseEntityAttributes.version.id}
          labelIcon={<TooltipWrapper tooltip={productReleaseEntityAttributes.version.tooltip} />}
        >
          <InputGroup>
            <InputGroupText>
              <ServiceContainerLoading {...serviceContainerProductVersion} variant="icon" title="Product Version">
                {serviceContainerProductVersion.data?.version}.
              </ServiceContainerLoading>
            </InputGroupText>
            <InputGroupItem isFill>
              <TextInput
                isRequired
                type="text"
                id={productReleaseEntityAttributes.version.id}
                name={productReleaseEntityAttributes.version.id}
                autoComplete="off"
                {...register<string>(productReleaseEntityAttributes.version.id, fieldConfigs.version)}
              />
            </InputGroupItem>
          </InputGroup>
          <FormInputHelperText variant="error">{getFieldErrors(productReleaseEntityAttributes.version.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup
          isRequired
          label={productReleaseEntityAttributes.releaseDate.title}
          fieldId={productReleaseEntityAttributes.releaseDate.id}
          labelIcon={<TooltipWrapper tooltip={productReleaseEntityAttributes.releaseDate.tooltip} />}
        >
          <DatePicker
            id={productReleaseEntityAttributes.releaseDate.id}
            name={productReleaseEntityAttributes.releaseDate.id}
            {...register<string>(productReleaseEntityAttributes.releaseDate.id, fieldConfigs.releaseDate)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productReleaseEntityAttributes.releaseDate.id)}
          </FormInputHelperText>
        </FormGroup>
        {isEditPage && (
          <FormGroup
            isRequired
            label={productReleaseEntityAttributes.productMilestone.title}
            fieldId={productReleaseEntityAttributes.productMilestone.id}
          >
            {serviceContainerEditPageGet.data?.productMilestone?.version}
          </FormGroup>
        )}
        {!isEditPage && (
          <FormGroup
            isRequired
            label={productReleaseEntityAttributes.productMilestone.title}
            fieldId={productReleaseEntityAttributes.productMilestone.id}
          >
            <FormInput<string>
              {...register<string>(productReleaseEntityAttributes.productMilestone.id, fieldConfigs.productMilestone)}
              render={({ value, onChange }) => (
                <SearchSelect
                  selectedItem={value}
                  onSelect={(event, _, productMilestone: ProductMilestone) => {
                    onChange(event, productMilestone.version!);
                    setSelectedProductMilestone(productMilestone);
                  }}
                  onClear={(event) => {
                    onChange(event, '');
                    setSelectedProductMilestone(undefined);
                  }}
                  fetchCallback={fetchProductMilestones}
                  titleAttribute={productMilestoneEntityAttributes.version.id}
                  placeholderText="Select Milestone"
                />
              )}
            />
            <FormInputHelperText variant="error">
              {getFieldErrors(productReleaseEntityAttributes.productMilestone.id)}
            </FormInputHelperText>
          </FormGroup>
        )}
        <FormGroup
          isRequired
          label={productReleaseEntityAttributes.supportLevel.title}
          fieldId={productReleaseEntityAttributes.supportLevel.id}
        >
          <FormInput<string>
            {...register<string>(productReleaseEntityAttributes.supportLevel.id, fieldConfigs.supportLevel)}
            render={({ value, validated, onChange, onBlur }) => (
              <Select
                menuAppendTo="parent"
                id={productReleaseEntityAttributes.supportLevel.id}
                name={productReleaseEntityAttributes.supportLevel.id}
                variant="single"
                isOpen={isSupportLevelSelectOpen}
                selections={value || undefined}
                validated={validated}
                onToggle={(_, value) => setIsSupportLevelSelectOpen(value)}
                onSelect={(event, supportLevel, isPlaceholder) => {
                  if (!isPlaceholder) {
                    onChange(event, supportLevel as string);
                    setIsSupportLevelSelectOpen(false);
                  }
                }}
                onBlur={onBlur}
                hasPlaceholderStyle
                placeholderText="Select support level"
              >
                {productReleaseEntityAttributes.supportLevel.values.map((supportLevel, index) => (
                  <SelectOption key={index} value={supportLevel} />
                ))}
              </Select>
            )}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productReleaseEntityAttributes.supportLevel.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          label={productReleaseEntityAttributes.commonPlatformEnumeration.title}
          fieldId={productReleaseEntityAttributes.commonPlatformEnumeration.id}
          labelIcon={<TooltipWrapper tooltip={productReleaseEntityAttributes.commonPlatformEnumeration.tooltip} />}
        >
          <TextInput
            type="text"
            id={productReleaseEntityAttributes.commonPlatformEnumeration.id}
            name={productReleaseEntityAttributes.commonPlatformEnumeration.id}
            autoComplete="off"
            {...register<string>(
              productReleaseEntityAttributes.commonPlatformEnumeration.id,
              fieldConfigs.commonPlatformEnumeration
            )}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productReleaseEntityAttributes.commonPlatformEnumeration.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          label={productReleaseEntityAttributes.productPagesCode.title}
          fieldId={productReleaseEntityAttributes.productPagesCode.id}
          labelIcon={<TooltipWrapper tooltip={productReleaseEntityAttributes.productPagesCode.tooltip} />}
        >
          <TextInput
            type="text"
            id={productReleaseEntityAttributes.productPagesCode.id}
            name={productReleaseEntityAttributes.productPagesCode.id}
            autoComplete="off"
            {...register<string>(productReleaseEntityAttributes.productPagesCode.id, fieldConfigs.productPagesCode)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productReleaseEntityAttributes.productPagesCode.id)}
          </FormInputHelperText>
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}>
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.productRelease}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? PageTitles.productReleaseEdit : PageTitles.productReleaseCreate}
      description={isEditPage ? <>You can edit current Release attributes below.</> : <>You can create a new Product Release.</>}
      breadcrumbs={
        isEditPage
          ? [
              { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
              { entity: breadcrumbData.productVersion.id, title: serviceContainerProductVersion.data?.version },
              { entity: breadcrumbData.productRelease.id, title: serviceContainerEditPageGet.data?.version },
              { entity: breadcrumbData.edit.id, title: PageTitles.productReleaseEdit, custom: true },
            ]
          : [
              { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
              { entity: breadcrumbData.productVersion.id, title: serviceContainerProductVersion.data?.version },
              { entity: breadcrumbData.productRelease.id, title: PageTitles.productReleaseCreate },
            ]
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Product Release"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
