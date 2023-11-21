import { CodeEditor } from '@patternfly/react-code-editor';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Select,
  SelectOption,
  Switch,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Environment, Product, ProductVersion } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { buildTypeData } from 'common/buildTypeData';
import { PageTitles } from 'common/constants';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { ExpandableFormSection, IExpandableFormSectionProps } from 'components/ExpandableFormSection/ExpandableFormSection';
import { FormInput } from 'components/FormInput/FormInput';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';

import * as buildConfigApi from 'services/buildConfigApi';
import * as environmentApi from 'services/environmentApi';
import * as productApi from 'services/productApi';

import { maxLengthValidator255 } from 'utils/formValidationHelpers';
import { generatePageTitle } from 'utils/titleHelper';

import styles from './BuildConfigCreateEditPage.module.css';

interface IBuildConfigCreateEditPageProps {
  isEditPage?: boolean;
}

const fieldConfigs = {
  name: {
    isRequired: true,
    validators: [maxLengthValidator255],
  },
  environment: {
    isRequired: true,
  },
  buildType: {
    isRequired: true,
  },
  buildScript: {
    isRequired: true,
  },
  brewPullActive: {
    value: false,
  },
} satisfies IFieldConfigs;

export const BuildConfigCreateEditPage = ({ isEditPage = false }: IBuildConfigCreateEditPageProps) => {
  const { buildConfigId } = useParamsRequired();
  const navigate = useNavigate();

  // create page
  const serviceContainerCreatePage = useServiceContainer(buildConfigApi.createBuildConfig);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(buildConfigApi.patchBuildConfig);

  const useFormObject = useForm();
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();
  const [selectedProductVersion, setSelectedProductVersion] = useState<ProductVersion>();
  const [parametersData, setParametersData] = useState<IParametersData>({});

  const [showGeneralAttributesSection, setShowGeneralAttributesSection] = useState<boolean>(true);
  const [showProductVersionSection, setShowProductVersionSection] = useState<boolean>(false);
  const [showBuildParametersSection, setShowBuildParametersSection] = useState<boolean>(false);

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
        <GeneralAttributesSection
          isExpanded={showGeneralAttributesSection}
          onToggle={(isExpanded) => setShowGeneralAttributesSection(isExpanded)}
          useFormObject={useFormObject}
          selectedEnvironment={selectedEnvironment}
          onEnvironmentSelect={setSelectedEnvironment}
        />

        <ProductVersionSection
          isExpanded={showProductVersionSection}
          onToggle={(isExpanded) => setShowProductVersionSection(isExpanded)}
          useFormObject={useFormObject}
          onProductVersionSelect={setSelectedProductVersion}
        />

        <BuildParametersSection
          isExpanded={showBuildParametersSection}
          onToggle={(isExpanded) => setShowBuildParametersSection(isExpanded)}
          parametersData={parametersData}
          onParametersDataChange={setParametersData}
        />

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

interface IGeneralAttributesSectionProps {
  isExpanded: boolean;
  onToggle: IExpandableFormSectionProps['onToggle'];
  useFormObject: ReturnType<typeof useForm>;
  selectedEnvironment: Environment | undefined;
  onEnvironmentSelect: (environment: Environment | undefined) => void;
}

const GeneralAttributesSection = ({
  isExpanded,
  onToggle,
  useFormObject,
  selectedEnvironment,
  onEnvironmentSelect,
}: IGeneralAttributesSectionProps) => {
  const [showDeprecatedEnvironments, setShowDeprecatedEnvironments] = useState<boolean>(false);

  const [isBuildTypeSelectOpen, setIsBuildTypeSelectOpen] = useState<boolean>(false);

  const fetchEnvironments = useCallback(
    (requestConfig = {}) => {
      return environmentApi.getEnvironments(
        { hidden: false, deprecated: !showDeprecatedEnvironments ? false : undefined },
        requestConfig
      );
    },
    [showDeprecatedEnvironments]
  );

  return (
    <ExpandableFormSection title="General Build Config attributes" isExpanded={isExpanded} onToggle={onToggle}>
      <ContentBox padding>
        <FormGroup
          isRequired
          label={buildConfigEntityAttributes.name.title}
          fieldId={buildConfigEntityAttributes.name.id}
          helperText={
            <FormHelperText isHidden={useFormObject.getFieldState(buildConfigEntityAttributes.name.id) !== 'error'} isError>
              {useFormObject.getFieldErrors(buildConfigEntityAttributes.name.id)}
            </FormHelperText>
          }
        >
          <TextInput
            isRequired
            type="text"
            id={buildConfigEntityAttributes.name.id}
            name={buildConfigEntityAttributes.name.id}
            autoComplete="off"
            {...useFormObject.register<string>(buildConfigEntityAttributes.name.id, fieldConfigs.name)}
          />
        </FormGroup>

        <FormGroup label={buildConfigEntityAttributes.description.title} fieldId={buildConfigEntityAttributes.description.id}>
          <TextArea
            id={buildConfigEntityAttributes.description.id}
            name={buildConfigEntityAttributes.description.id}
            autoResize
            resizeOrientation="vertical"
            className={styles['text-area']}
            {...useFormObject.register<string>(buildConfigEntityAttributes.description.id)}
          />
        </FormGroup>

        <FormGroup
          isRequired
          label={buildConfigEntityAttributes.environment.title}
          fieldId={buildConfigEntityAttributes.environment.id}
          helperText={
            <>
              <FormHelperText
                isHidden={useFormObject.getFieldState(buildConfigEntityAttributes.environment.id) !== 'error'}
                isError
              >
                {useFormObject.getFieldErrors(buildConfigEntityAttributes.environment.id)}
              </FormHelperText>

              {selectedEnvironment?.deprecated && (
                <HelperText>
                  <HelperTextItem hasIcon variant="warning">
                    Selected Environment is deprecated
                  </HelperTextItem>
                </HelperText>
              )}
            </>
          }
        >
          <FormInput<string>
            {...useFormObject.register<string>(buildConfigEntityAttributes.environment.id, fieldConfigs.environment)}
            render={({ value, validated, onChange }) => (
              <SearchSelect
                selectedItem={value}
                validated={validated}
                onSelect={(_, environment: Environment) => {
                  onChange(environment.name!);
                  onEnvironmentSelect(environment);
                }}
                onClear={() => {
                  onChange('');
                  onEnvironmentSelect(undefined);
                }}
                fetchCallback={fetchEnvironments}
                titleAttribute="name"
                placeholderText="Select Environment"
                getHighlightText={(environment: Environment) =>
                  environment.deprecated ? (
                    <>
                      <ExclamationTriangleIcon color="#F0AB00" /> DEPRECATED
                    </>
                  ) : null
                }
              />
            )}
          />
          <Checkbox
            id="show-deprecated"
            label="Show also deprecated"
            isChecked={showDeprecatedEnvironments}
            onChange={(checked) => {
              setShowDeprecatedEnvironments(checked);
            }}
            className="m-t-5"
          />
        </FormGroup>

        <FormGroup
          isRequired
          label={buildConfigEntityAttributes.buildType.title}
          fieldId={buildConfigEntityAttributes.buildType.id}
          helperText={
            <FormHelperText isHidden={useFormObject.getFieldState(buildConfigEntityAttributes.buildType.id) !== 'error'} isError>
              {useFormObject.getFieldErrors(buildConfigEntityAttributes.buildType.id)}
            </FormHelperText>
          }
        >
          <FormInput<string>
            {...useFormObject.register<string>(buildConfigEntityAttributes.buildType.id, fieldConfigs.buildType)}
            render={({ value, validated, onChange, onBlur }) => (
              <Select
                menuAppendTo="parent"
                id={buildConfigEntityAttributes.buildType.id}
                name={buildConfigEntityAttributes.buildType.id}
                variant="single"
                isOpen={isBuildTypeSelectOpen}
                selections={value || undefined}
                validated={validated}
                onToggle={setIsBuildTypeSelectOpen}
                onSelect={(_, buildType, isPlaceholder) => {
                  if (!isPlaceholder) {
                    onChange(buildType as string);
                    setIsBuildTypeSelectOpen(false);
                  }
                }}
                onBlur={onBlur}
                hasPlaceholderStyle
                placeholderText="Select Build type"
              >
                {buildConfigEntityAttributes.buildType.values.map((buildType, index) => (
                  <SelectOption key={index} value={buildType}>
                    {buildTypeData[buildType].title}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroup>

        <FormGroup
          isRequired
          label={buildConfigEntityAttributes.buildScript.title}
          fieldId={buildConfigEntityAttributes.buildScript.id}
          helperText={
            <FormHelperText
              isHidden={useFormObject.getFieldState(buildConfigEntityAttributes.buildScript.id) !== 'error'}
              isError
            >
              {useFormObject.getFieldErrors(buildConfigEntityAttributes.buildScript.id)}
            </FormHelperText>
          }
        >
          <FormInput<string>
            {...useFormObject.register<string>(buildConfigEntityAttributes.buildScript.id, fieldConfigs.buildScript)}
            render={({ value, onChange }) => <CodeEditor code={value} onChange={onChange} isLineNumbersVisible height="250px" />}
          />
        </FormGroup>

        <FormGroup
          label={buildConfigEntityAttributes.brewPullActive.title}
          fieldId={buildConfigEntityAttributes.brewPullActive.id}
        >
          <FormInput<boolean>
            {...useFormObject.register<boolean>(buildConfigEntityAttributes.brewPullActive.id, fieldConfigs.brewPullActive)}
            render={({ value, onChange, onBlur }) => (
              <Switch
                id={buildConfigEntityAttributes.brewPullActive.id}
                name={buildConfigEntityAttributes.brewPullActive.id}
                label="Enabled"
                labelOff="Disabled"
                isChecked={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </FormGroup>
      </ContentBox>
    </ExpandableFormSection>
  );
};

interface IProductVersionSectionProps {
  isExpanded: boolean;
  onToggle: IExpandableFormSectionProps['onToggle'];
  useFormObject: ReturnType<typeof useForm>;
  onProductVersionSelect: (productVersion: ProductVersion | undefined) => void;
}

const ProductVersionSection = ({ isExpanded, onToggle, useFormObject, onProductVersionSelect }: IProductVersionSectionProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const fetchProductVersions = useCallback(
    (requestConfig = {}) => {
      return selectedProduct ? productApi.getProductVersions({ id: selectedProduct.id }, requestConfig) : Promise.resolve([]);
    },
    [selectedProduct]
  );

  const productVersionRegisterObject = useFormObject.register<string>(buildConfigEntityAttributes.productVersion.id);

  return (
    <ExpandableFormSection title="Product Version" isExpanded={isExpanded} onToggle={onToggle}>
      <ContentBox padding>
        <FormGroup label={`Product ${productEntityAttributes.name.title}`} fieldId={productEntityAttributes.name.id}>
          <SearchSelect
            selectedItem={selectedProduct?.name}
            onSelect={(_, product: Product) => {
              setSelectedProduct(product);
              productVersionRegisterObject.onChange('');
              onProductVersionSelect(undefined);
            }}
            onClear={() => {
              setSelectedProduct(undefined);
              productVersionRegisterObject.onChange('');
              onProductVersionSelect(undefined);
            }}
            fetchCallback={productApi.getProducts}
            titleAttribute="name"
            placeholderText="Select Product"
          />
        </FormGroup>

        <FormGroup
          label={buildConfigEntityAttributes.productVersion.title}
          fieldId={buildConfigEntityAttributes.productVersion.id}
        >
          <FormInput<string>
            {...productVersionRegisterObject}
            render={({ value, validated, onChange }) => (
              <SearchSelect
                selectedItem={value}
                validated={validated}
                onSelect={(_, productVersion: ProductVersion) => {
                  onChange(productVersion.version);
                  onProductVersionSelect(productVersion);
                }}
                onClear={() => {
                  onChange('');
                  onProductVersionSelect(undefined);
                }}
                fetchCallback={fetchProductVersions}
                titleAttribute="version"
                placeholderText="Select Version"
                isDisabled={!selectedProduct}
              />
            )}
          />
        </FormGroup>
      </ContentBox>
    </ExpandableFormSection>
  );
};

interface IParametersData {
  [key: string]: string;
}

interface IBuildParametersSectionProps {
  isExpanded: boolean;
  onToggle: IExpandableFormSectionProps['onToggle'];
  parametersData: IParametersData;
  onParametersDataChange: (parametersData: IParametersData) => void;
}

const BuildParametersSection = ({
  isExpanded,
  onToggle,
  parametersData,
  onParametersDataChange,
}: IBuildParametersSectionProps) => {
  const serviceContainerParameters = useServiceContainer(buildConfigApi.getSupportedParameters);
  const serviceContainerParametersRunner = serviceContainerParameters.run;

  useEffect(() => {
    serviceContainerParametersRunner().then((response) => {
      onParametersDataChange(Object.fromEntries(response.data!.map((parameter) => [parameter.name!, ''])));
    });
  }, [serviceContainerParametersRunner, onParametersDataChange]);

  return (
    <ExpandableFormSection title="Build Parameters" isExpanded={isExpanded} onToggle={onToggle}>
      <ContentBox padding>
        {serviceContainerParameters.data?.map((parameter, index) => (
          <FormGroup
            key={index}
            label={parameter.name}
            helperText={
              <FormHelperText isHidden={false}>
                <HelperText>
                  <HelperTextItem>{parameter.description}</HelperTextItem>
                </HelperText>
              </FormHelperText>
            }
            isHelperTextBeforeField
            className="m-b-15"
          >
            <TextInput
              id="parameter-value"
              type="text"
              autoComplete="off"
              value={parametersData[parameter.name!]}
              onChange={(value) => onParametersDataChange({ ...parametersData, [parameter.name!]: value })}
            />
          </FormGroup>
        ))}
      </ContentBox>
    </ExpandableFormSection>
  );
};
