import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { maxLengthValidator, validateDate } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime, getProductVersionSuffix, parseDate } from 'utils/utils';

const validateDates = (fieldValues: IFieldValues): boolean => {
  return (
    !fieldValues.startingDate ||
    !fieldValues.plannedEndDate ||
    !validateDate(fieldValues.startingDate) ||
    !validateDate(fieldValues.plannedEndDate) ||
    new Date(fieldValues.startingDate) < new Date(fieldValues.plannedEndDate)
  );
};

const fieldConfigs = {
  version: {
    // TODO: NCL-8162 implementing async validation
    isRequired: true,
    validators: [maxLengthValidator(50)],
  },
  startingDate: {
    isRequired: true,
    validators: [
      { validator: validateDate, errorMessage: 'Invalid date format.' },
      {
        validator: validateDates,
        errorMessage: 'Start date must be before planned end date.',
        relatedFields: ['plannedEndDate'],
      },
    ],
  },
  plannedEndDate: {
    isRequired: true,
    validators: [
      { validator: validateDate, errorMessage: 'Invalid date format.' },
      {
        validator: validateDates,
        errorMessage: 'Planned end date must be after start date.',
        relatedFields: ['startingDate'],
      },
    ],
  },
} satisfies IFieldConfigs;

interface IProductMilestoneCreateEditPageProps {
  isEditPage?: boolean;
}

export const ProductMilestoneCreateEditPage = ({ isEditPage = false }: IProductMilestoneCreateEditPageProps) => {
  const { productMilestoneId, productVersionId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(productMilestoneApi.createProductMilestone);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(productMilestoneApi.patchProductMilestone);

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerProductVersionPatch = useServiceContainer(productVersionApi.patchProductVersion);

  const { register, setFieldValues, getFieldErrors, handleSubmit, isSubmitDisabled, hasFormChanged } = useForm();

  const isProductMilestoneCurrent =
    serviceContainerProductVersion.data?.currentProductMilestone &&
    serviceContainerProductVersion.data.currentProductMilestone.id === productMilestoneId;

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: [serviceContainerProductVersion.data?.version, serviceContainerProductVersion.data?.product?.name],
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage.run({
      serviceData: {
        data: {
          version: serviceContainerProductVersion.data?.version + '.' + data.version,
          startingDate: parseDate(data.startingDate),
          plannedEndDate: parseDate(data.plannedEndDate),
          productVersion: { id: serviceContainerProductVersion.data?.id },
        } as ProductMilestone,
      },
      onSuccess: (result) => {
        const newProductMilestoneId = result.response.data.id;
        if (!newProductMilestoneId) {
          throw new PncError({
            code: 'NEW_ENTITY_ID_ERROR',
            message: `Invalid productMilestoneId coming from Orch POST response: ${newProductMilestoneId}`,
          });
        }

        if (data.isCurrent) {
          const patchProductVersionData = createSafePatch(serviceContainerProductVersion.data!, {
            currentProductMilestone: { id: newProductMilestoneId },
          });

          return serviceContainerProductVersionPatch.run({
            serviceData: { id: serviceContainerProductVersion.data!.id, patchData: patchProductVersionData },
            onSuccess: () => navigate(`../${newProductMilestoneId}`),
            onError: () => console.error('Failed to edit current Product Milestone.'),
          });
        } else {
          navigate(`../${newProductMilestoneId}`);
        }
      },
      onError: () => console.error('Failed to create Product Milestone.'),
    });
  };

  const submitEdit = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data!, {
      version: serviceContainerProductVersion.data?.version + '.' + data.version,
      startingDate: parseDate(data.startingDate),
      plannedEndDate: parseDate(data.plannedEndDate),
    });

    return serviceContainerEditPagePatch.run({
      serviceData: { id: productMilestoneId, patchData },
      onSuccess: () => {
        if (data.isCurrent) {
          const patchProductVersionData = createSafePatch(serviceContainerProductVersion.data!, {
            currentProductMilestone: { id: productMilestoneId },
          });

          return serviceContainerProductVersionPatch.run({
            serviceData: { id: serviceContainerProductVersion.data!.id, patchData: patchProductVersionData },
            onSuccess: () => navigate('..'),
            onError: () => console.error('Failed to edit current Product Milestone.'),
          });
        } else {
          navigate('..');
        }
      },
      onError: () => console.error('Failed to edit Product Milestone.'),
    });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({
        serviceData: { id: productMilestoneId },
        onSuccess: (result) => {
          const productMilestone: ProductMilestone = result.response.data;
          const productMilestoneVersionShort = getProductVersionSuffix(productMilestone);
          const startingDate = productMilestone.startingDate && createDateTime({ date: productMilestone.startingDate }).date;
          const plannedEndDate =
            productMilestone.plannedEndDate && createDateTime({ date: productMilestone.plannedEndDate }).date;

          setFieldValues({ version: productMilestoneVersionShort, startingDate, plannedEndDate });
        },
      });
    }
  }, [isEditPage, productMilestoneId, serviceContainerEditPageGetRunner, setFieldValues]);

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
          label={productMilestoneEntityAttributes.version.title}
          fieldId={productMilestoneEntityAttributes.version.id}
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
                id={productMilestoneEntityAttributes.version.id}
                name={productMilestoneEntityAttributes.version.id}
                autoComplete="off"
                {...register<string>(productMilestoneEntityAttributes.version.id, fieldConfigs.version)}
              />
            </InputGroupItem>
          </InputGroup>
          <FormInputHelperText variant="error">{getFieldErrors(productMilestoneEntityAttributes.version.id)}</FormInputHelperText>
        </FormGroup>
        <FormGroup
          isRequired
          label={productMilestoneEntityAttributes.startingDate.title}
          fieldId={productMilestoneEntityAttributes.startingDate.id}
        >
          <DatePicker
            id={productMilestoneEntityAttributes.startingDate.id}
            name={productMilestoneEntityAttributes.startingDate.id}
            {...register<string>(productMilestoneEntityAttributes.startingDate.id, fieldConfigs.startingDate)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productMilestoneEntityAttributes.startingDate.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup
          isRequired
          label={productMilestoneEntityAttributes.plannedEndDate.title}
          fieldId={productMilestoneEntityAttributes.plannedEndDate.id}
        >
          <DatePicker
            id={productMilestoneEntityAttributes.plannedEndDate.id}
            name={productMilestoneEntityAttributes.plannedEndDate.id}
            {...register<string>(productMilestoneEntityAttributes.plannedEndDate.id, fieldConfigs.plannedEndDate)}
          />
          <FormInputHelperText variant="error">
            {getFieldErrors(productMilestoneEntityAttributes.plannedEndDate.id)}
          </FormInputHelperText>
        </FormGroup>
        <FormGroup fieldId={productMilestoneEntityAttributes.isCurrent.id}>
          <ServiceContainerLoading {...serviceContainerProductVersion} variant="inline" title="Product Version">
            <FormInput<boolean>
              {...register<boolean>(productMilestoneEntityAttributes.isCurrent.id)}
              render={({ value, onChange, onBlur }) => {
                const switchLabel = `Set as the current Milestone for ${serviceContainerProductVersion.data?.product?.name} ${serviceContainerProductVersion.data?.version}`;

                return (
                  <TooltipWrapper tooltip={isProductMilestoneCurrent ? 'Already marked as current.' : undefined}>
                    <Switch
                      id={productMilestoneEntityAttributes.isCurrent.id}
                      name={productMilestoneEntityAttributes.isCurrent.id}
                      label={switchLabel}
                      isChecked={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      isDisabled={isProductMilestoneCurrent}
                    />
                  </TooltipWrapper>
                );
              }}
            />
          </ServiceContainerLoading>
          <FormInputHelperText variant="error">
            {getFieldErrors(productMilestoneEntityAttributes.isCurrent.id)}
          </FormInputHelperText>
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled || !!serviceContainerProductVersion.error}
            onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}
          >
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.productMilestone}
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <ServiceContainerLoading {...serviceContainerProductVersion} title={EntityTitles.productVersion}>
      <PageLayout
        title={isEditPage ? PageTitles.productMilestoneEdit : PageTitles.productMilestoneCreate}
        description={
          isEditPage ? <>You can edit current Milestone attributes below.</> : <>You can create a new Product Milestone.</>
        }
        breadcrumbs={
          isEditPage
            ? [
                { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
                {
                  entity: breadcrumbData.productVersion.id,
                  title: serviceContainerProductVersion.data?.version,
                },
                { entity: breadcrumbData.productMilestone.id, title: serviceContainerEditPageGet.data?.version, url: '-/edit' },
                { entity: breadcrumbData.edit.id, title: PageTitles.productMilestoneEdit, custom: true },
              ]
            : [
                { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
                {
                  entity: breadcrumbData.productVersion.id,
                  title: serviceContainerProductVersion.data?.version,
                },
                { entity: breadcrumbData.create.id, title: PageTitles.productMilestoneCreate },
              ]
        }
      >
        {isEditPage ? (
          <ServiceContainerCreatingUpdating
            {...serviceContainerEditPagePatch}
            serviceContainerLoading={serviceContainerEditPageGet}
            title="Product Milestone"
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
