import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormHelperText,
  InputGroup,
  InputGroupText,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProductMilestone } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { FormInput } from 'components/FormInput/FormInput';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';
import * as productVersionApi from 'services/productVersionApi';

import { validateDate } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';
import { createDateTime, getShortProductMilestoneVersion, parseDate } from 'utils/utils';

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
  const { productMilestoneId } = useParams();
  const { productVersionId } = useParams();
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

  const { register, setFieldValues, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  const isProductMilestoneCurrent = serviceContainerProductVersion.data?.currentProductMilestone?.id === productMilestoneId;

  useTitle(
    generatePageTitle({
      pageType: isEditPage ? 'Edit' : 'Create',
      serviceContainer: serviceContainerEditPageGet,
      firstLevelEntity: 'Product',
      nestedEntity: 'Milestone',
      entityName: `${serviceContainerEditPageGet.data?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  const submitCreate = (data: IFieldValues) => {
    return serviceContainerCreatePage
      .run({
        serviceData: {
          data: {
            version: serviceContainerProductVersion.data?.version + '.' + data.version,
            startingDate: parseDate(data.startingDate),
            plannedEndDate: parseDate(data.plannedEndDate),
            productVersion: { id: serviceContainerProductVersion.data?.id },
          },
        },
      })
      .then((response: any) => {
        const newProductMilestoneId = response?.data?.id;
        if (!newProductMilestoneId) {
          throw new Error(`Invalid productMilestoneId coming from Orch POST response: ${newProductMilestoneId}`);
        }

        if (data.isCurrent) {
          const patchProductVersionData = createSafePatch(serviceContainerProductVersion.data, {
            currentProductMilestone: { id: newProductMilestoneId },
          });

          serviceContainerProductVersionPatch
            .run({ serviceData: { id: serviceContainerProductVersion.data?.id, patchData: patchProductVersionData } })
            .then(() => navigate(`../${newProductMilestoneId}`))
            .catch(() => {
              console.error('Failed to edit current Product Milestone.');
            });
        } else {
          navigate(`../${newProductMilestoneId}`);
        }
      })
      .catch((e: any) => {
        throw new Error('Failed to create Product Milestone.');
      });
  };

  const submitUpdate = (data: IFieldValues) => {
    const patchData = createSafePatch(serviceContainerEditPageGet.data, {
      version: serviceContainerProductVersion.data?.version + '.' + data.version,
      startingDate: parseDate(data.startingDate),
      plannedEndDate: parseDate(data.plannedEndDate),
    });

    serviceContainerEditPagePatch
      .run({ serviceData: { id: productMilestoneId, patchData } })
      .then(() => {
        if (data.isCurrent) {
          const patchProductVersionData = createSafePatch(serviceContainerProductVersion.data, {
            currentProductMilestone: { id: productMilestoneId },
          });

          serviceContainerProductVersionPatch
            .run({ serviceData: { id: serviceContainerProductVersion.data?.id, patchData: patchProductVersionData } })
            .then(() => navigate('..'))
            .catch(() => {
              console.error('Failed to edit current Product Milestone.');
            });
        } else {
          navigate('..');
        }
      })
      .catch(() => {
        throw new Error('Failed to edit Product Milestone.');
      });
  };

  useEffect(() => {
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: productMilestoneId } }).then((response: any) => {
        const productMilestone: ProductMilestone = response.data;
        const productMilestoneVersionShort = getShortProductMilestoneVersion(productMilestone);
        const startingDate = productMilestone.startingDate && createDateTime({ date: productMilestone.startingDate }).date;
        const plannedEndDate = productMilestone.plannedEndDate && createDateTime({ date: productMilestone.plannedEndDate }).date;

        setFieldValues({ version: productMilestoneVersionShort, startingDate, plannedEndDate });
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
          helperText={
            <FormHelperText isHidden={getFieldState(productMilestoneEntityAttributes.version.id) !== 'error'} isError>
              {getFieldErrors(productMilestoneEntityAttributes.version.id)}
            </FormHelperText>
          }
        >
          <InputGroup>
            <InputGroupText>
              <ServiceContainerLoading {...serviceContainerProductVersion} variant="icon" title="Product Version">
                {serviceContainerProductVersion.data?.version}.
              </ServiceContainerLoading>
            </InputGroupText>
            <TextInput
              isRequired
              type="text"
              id={productMilestoneEntityAttributes.version.id}
              name={productMilestoneEntityAttributes.version.id}
              autoComplete="off"
              {...register<string>(productMilestoneEntityAttributes.version.id, fieldConfigs.version)}
            />
          </InputGroup>
        </FormGroup>
        <FormGroup
          isRequired
          label={productMilestoneEntityAttributes.startingDate.title}
          fieldId={productMilestoneEntityAttributes.startingDate.id}
          helperText={
            <FormHelperText isHidden={getFieldState(productMilestoneEntityAttributes.startingDate.id) !== 'error'} isError>
              {getFieldErrors(productMilestoneEntityAttributes.startingDate.id)}
            </FormHelperText>
          }
        >
          <DatePicker
            id={productMilestoneEntityAttributes.startingDate.id}
            name={productMilestoneEntityAttributes.startingDate.id}
            {...register<string>(productMilestoneEntityAttributes.startingDate.id, fieldConfigs.startingDate)}
          />
        </FormGroup>
        <FormGroup
          isRequired
          label={productMilestoneEntityAttributes.plannedEndDate.title}
          fieldId={productMilestoneEntityAttributes.plannedEndDate.id}
          helperText={
            <FormHelperText isHidden={getFieldState(productMilestoneEntityAttributes.plannedEndDate.id) !== 'error'} isError>
              {getFieldErrors(productMilestoneEntityAttributes.plannedEndDate.id)}
            </FormHelperText>
          }
        >
          <DatePicker
            id={productMilestoneEntityAttributes.plannedEndDate.id}
            name={productMilestoneEntityAttributes.plannedEndDate.id}
            {...register<string>(productMilestoneEntityAttributes.plannedEndDate.id, fieldConfigs.plannedEndDate)}
          />
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
                      labelOff={switchLabel}
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
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={isSubmitDisabled || !!serviceContainerProductVersion.error}
            onClick={handleSubmit(isEditPage ? submitUpdate : submitCreate)}
          >
            {isEditPage ? 'Update' : 'Create'} Milestone
          </Button>
        </ActionGroup>
      </Form>
    </ContentBox>
  );

  return (
    <PageLayout
      title={isEditPage ? 'Update Milestone' : 'Create Milestone'}
      description={
        isEditPage ? <>You can update current Milestone attributes below.</> : <>You can create a new Product Milestone.</>
      }
    >
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Product Milestone"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating {...serviceContainerCreatePage}>{formComponent}</ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
