import { CodeEditor } from '@patternfly/react-code-editor';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  InputGroup,
  Select,
  SelectOption,
  Switch,
  Text,
  TextArea,
  TextContent,
  TextInput,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useState } from 'react';

import { BuildConfiguration, Environment, Product, ProductVersion, SCMRepository, SCMRepositoryPage } from 'pnc-api-types-ts';

import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { buildTypeData } from 'common/buildTypeData';
import { PageTitles } from 'common/constants';
import { productEntityAttributes } from 'common/productEntityAttributes';
import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { usePatchOperation } from 'hooks/usePatchOperation';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionConfirmModal } from 'components/ActionConfirmModal/ActionConfirmModal';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CreatableSelect } from 'components/CreatableSelect/CreatableSelect';
import { ExpandableSection } from 'components/ExpandableSection/ExpandableSection';
import { FormInput } from 'components/FormInput/FormInput';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ConfigsAddList } from 'components/ProductVersionBuildConfigsEditPage/ConfigsAddList';
import { ConfigsChangesList } from 'components/ProductVersionBuildConfigsEditPage/ConfigsChangesList';
import { RemoveItemButton } from 'components/RemoveItemButton/RemoveItemButton';
import { ScmRepositoryUrlAlert } from 'components/ScmRepositoryUrlAlert/ScmRepositoryUrlAlert';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TextInputFindMatch } from 'components/TextInputFindMatch/TextInputFindMatch';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildConfigApi from 'services/buildConfigApi';
import * as environmentApi from 'services/environmentApi';
import * as productApi from 'services/productApi';
import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { maxLengthValidator255, validateBuildScript, validateScmUrl } from 'utils/formValidationHelpers';
import { generatePageTitle } from 'utils/titleHelper';

interface IBuildParamOption {
  title: string;
  description?: string;
}

interface IBuildParamData {
  [title: string]: { value: string; description?: string };
}

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
    validators: [
      {
        validator: validateBuildScript,
        errorMessage: '',
        relatedFields: ['buildScript'],
      },
    ],
  },
  buildScript: {
    isRequired: true,
    validators: [
      {
        validator: validateBuildScript,
        errorMessage: "The 'deploy' goal is required for maven builds in order to prevent artifact promotion issues.",
        relatedFields: ['buildType'],
      },
    ],
  },
  brewPullActive: {
    value: false,
  },
  scmUrl: {
    isRequired: true,
    validators: [{ validator: validateScmUrl, errorMessage: 'Invalid URL format.' }],
  },
  scmRevision: {
    isRequired: true,
  },
} satisfies IFieldConfigs;

export const BuildConfigCreateEditPage = ({ isEditPage = false }: IBuildConfigCreateEditPageProps) => {
  const { buildConfigId } = useParamsRequired();

  // create page
  const serviceContainerCreatePage = useServiceContainer(buildConfigApi.createBuildConfig);

  // edit page - get method
  const serviceContainerEditPageGet = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerEditPageGetRunner = serviceContainerEditPageGet.run;

  // edit page - patch method
  const serviceContainerEditPagePatch = useServiceContainer(buildConfigApi.patchBuildConfig);

  const serviceContainerParameters = useServiceContainer(buildConfigApi.getSupportedParameters);
  const serviceContainerParametersRunner = serviceContainerParameters.run;

  const serviceContainerScmRepositories = useServiceContainer(scmRepositoryApi.getScmRepositoriesFiltered, 0);

  const serviceContainerProjectBuildConfigs = useServiceContainer(buildConfigApi.getBuildConfigs);
  const serviceContainerProjectBuildConfigsRunner = serviceContainerProjectBuildConfigs.run;

  const componentIdBuildConfigs = 'bc1';

  const [showProductVersionSection, setShowProductVersionSection] = useState<boolean>(false);
  const [showBuildParametersSection, setShowBuildParametersSection] = useState<boolean>(false);
  const [showDependenciesSection, setShowDependenciesSection] = useState<boolean>(false);

  const { register, getFieldValue, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedProductVersion, setSelectedProductVersion] = useState<ProductVersion>();
  const [buildParamData, setBuildParamData] = useState<IBuildParamData>({});
  const [selectedScmRepository, setSelectedScmRepository] = useState<SCMRepository>();

  const [showDeprecatedEnvironments, setShowDeprecatedEnvironments] = useState<boolean>(false);
  const [isBuildTypeSelectOpen, setIsBuildTypeSelectOpen] = useState<boolean>(false);
  const [buildParamOptions, setBuildParamOptions] = useState<IBuildParamOption[]>([]);
  const [selectedBuildParamOption, setSelectedBuildParamOption] = useState<string>();
  const [isBuildParamSelectOpen, setIsBuildParamSelectOpen] = useState<boolean>(false);
  const [isBuildCategorySelectOpen, setIsBuildCategorySelectOpen] = useState<boolean>(false);
  const [isCancelAllModalOpen, setIsCancelAllModalOpen] = useState<boolean>(false);
  const toggleCancelAllModal = () => setIsCancelAllModalOpen((isCancelAllModalOpen) => !isCancelAllModalOpen);

  const {
    operations: buildConfigChanges,
    addedData: addedBuildConfigs,
    insertOperation: insertBuildConfigChange,
    cancelOperation: cancelBuildConfigChange,
    cancelAllOperations: cancelAllBuildConfigChanges,
  } = usePatchOperation<BuildConfiguration>();

  const productVersionRegisterObject = register<string>(buildConfigEntityAttributes.productVersion.id);

  const fetchEnvironments = useCallback(
    (requestConfig = {}) => {
      return environmentApi.getEnvironments(
        { hidden: false, deprecated: !showDeprecatedEnvironments ? false : undefined },
        requestConfig
      );
    },
    [showDeprecatedEnvironments]
  );

  const fetchProductVersions = useCallback(
    (requestConfig = {}) => {
      return selectedProduct ? productApi.getProductVersions({ id: selectedProduct.id }, requestConfig) : Promise.resolve([]);
    },
    [selectedProduct]
  );

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

  useEffect(() => {
    serviceContainerParametersRunner().then((response) => {
      setBuildParamOptions(response.data?.map((parameter) => ({ title: parameter.name!, description: parameter.description })));
    });
  }, [serviceContainerParametersRunner]);

  useQueryParamsEffect(serviceContainerProjectBuildConfigsRunner, { componentId: componentIdBuildConfigs });

  const formComponent = (
    <>
      <ContentBox padding marginBottom>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FormGroup
            isRequired
            label={buildConfigEntityAttributes.name.title}
            fieldId={buildConfigEntityAttributes.name.id}
            helperText={
              <FormHelperText isHidden={getFieldState(buildConfigEntityAttributes.name.id) !== 'error'} isError>
                {getFieldErrors(buildConfigEntityAttributes.name.id)}
              </FormHelperText>
            }
          >
            <TextInput
              isRequired
              type="text"
              id={buildConfigEntityAttributes.name.id}
              name={buildConfigEntityAttributes.name.id}
              autoComplete="off"
              {...register<string>(buildConfigEntityAttributes.name.id, fieldConfigs.name)}
            />
          </FormGroup>

          <FormGroup label={buildConfigEntityAttributes.description.title} fieldId={buildConfigEntityAttributes.description.id}>
            <TextArea
              id={buildConfigEntityAttributes.description.id}
              name={buildConfigEntityAttributes.description.id}
              autoResize
              resizeOrientation="vertical"
              {...register<string>(buildConfigEntityAttributes.description.id)}
            />
          </FormGroup>

          <FormGroup
            isRequired
            label={buildConfigEntityAttributes.environment.title}
            fieldId={buildConfigEntityAttributes.environment.id}
            helperText={
              <>
                <FormHelperText isHidden={getFieldState(buildConfigEntityAttributes.environment.id) !== 'error'} isError>
                  {getFieldErrors(buildConfigEntityAttributes.environment.id)}
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
              {...register<string>(buildConfigEntityAttributes.environment.id, fieldConfigs.environment)}
              render={({ value, validated, onChange }) => (
                <SearchSelect
                  selectedItem={value}
                  validated={validated}
                  onSelect={(_, environment: Environment) => {
                    onChange(environment.description!);
                    setSelectedEnvironment(environment);
                  }}
                  onClear={() => {
                    onChange('');
                    setSelectedEnvironment(undefined);
                  }}
                  fetchCallback={fetchEnvironments}
                  titleAttribute="description"
                  placeholderText="Select Environment"
                  getCustomDescription={(environment: Environment) =>
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
              <FormHelperText isHidden={getFieldState(buildConfigEntityAttributes.buildType.id) !== 'error'} isError>
                {getFieldErrors(buildConfigEntityAttributes.buildType.id)}
              </FormHelperText>
            }
          >
            <FormInput<string>
              {...register<string>(buildConfigEntityAttributes.buildType.id, fieldConfigs.buildType)}
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
              <FormHelperText isHidden={getFieldState(buildConfigEntityAttributes.buildScript.id) !== 'error'} isError>
                {getFieldErrors(buildConfigEntityAttributes.buildScript.id)}
              </FormHelperText>
            }
          >
            <FormInput<string>
              {...register<string>(buildConfigEntityAttributes.buildScript.id, fieldConfigs.buildScript)}
              render={({ value, onChange }) => (
                <CodeEditor code={value} onChange={onChange} isLineNumbersVisible height="250px" />
              )}
            />
          </FormGroup>

          <FormGroup
            label={buildConfigEntityAttributes.brewPullActive.title}
            fieldId={buildConfigEntityAttributes.brewPullActive.id}
          >
            <FormInput<boolean>
              {...register<boolean>(buildConfigEntityAttributes.brewPullActive.id, fieldConfigs.brewPullActive)}
              render={({ value, onChange, onBlur }) => {
                const isDisabled = getFieldValue(buildConfigEntityAttributes.buildType.id) === buildTypeData.NPM.id;

                return (
                  <TooltipWrapper tooltip={isDisabled ? 'Cannot set Brew pull active for the NPM build type.' : undefined}>
                    <Switch
                      id={buildConfigEntityAttributes.brewPullActive.id}
                      name={buildConfigEntityAttributes.brewPullActive.id}
                      label="Enabled"
                      labelOff="Disabled"
                      isChecked={!isDisabled ? value : false}
                      onChange={onChange}
                      onBlur={onBlur}
                      isDisabled={isDisabled}
                    />
                  </TooltipWrapper>
                );
              }}
            />
          </FormGroup>
        </Form>
      </ContentBox>

      <ContentBox padding marginBottom>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FormGroup
            isRequired
            label={scmRepositoryEntityAttributes.scmUrl.title}
            fieldId={scmRepositoryEntityAttributes.scmUrl.id}
            labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.scmUrl.tooltip} />}
            helperText={
              <FormHelperText isHidden={getFieldState(scmRepositoryEntityAttributes.scmUrl.id) !== 'error'} isError>
                {getFieldErrors(scmRepositoryEntityAttributes.scmUrl.id)}
              </FormHelperText>
            }
          >
            <FormInput
              {...register<string>(scmRepositoryEntityAttributes.scmUrl.id, fieldConfigs.scmUrl)}
              render={(registerData) => (
                <TextInputFindMatch
                  isRequired
                  type="text"
                  id={scmRepositoryEntityAttributes.scmUrl.id}
                  name={scmRepositoryEntityAttributes.scmUrl.id}
                  autoComplete="off"
                  validator={(value) => !!value && validateScmUrl(value)}
                  fetchCallback={(value) => serviceContainerScmRepositories.run({ serviceData: { matchUrl: value } })}
                  onMatch={(scmRepositories: SCMRepositoryPage) => setSelectedScmRepository(scmRepositories.content?.[0])}
                  onNoMatch={() => setSelectedScmRepository(undefined)}
                  {...registerData}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            isRequired
            label={buildConfigEntityAttributes.scmRevision.title}
            fieldId={buildConfigEntityAttributes.scmRevision.id}
            helperText={
              <FormHelperText isHidden={getFieldState(buildConfigEntityAttributes.scmRevision.id) !== 'error'} isError>
                {getFieldErrors(buildConfigEntityAttributes.scmRevision.id)}
              </FormHelperText>
            }
          >
            <TextInput
              isRequired
              type="text"
              id={buildConfigEntityAttributes.scmRevision.id}
              name={buildConfigEntityAttributes.scmRevision.id}
              autoComplete="off"
              {...register<string>(buildConfigEntityAttributes.scmRevision.id, fieldConfigs.scmRevision)}
            />
          </FormGroup>

          <FormGroup
            label={scmRepositoryEntityAttributes.preBuildSyncEnabled.title}
            fieldId={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
            labelIcon={<TooltipWrapper tooltip={scmRepositoryEntityAttributes.preBuildSyncEnabled.tooltip} />}
          >
            <FormInput<boolean>
              {...register<boolean>(scmRepositoryEntityAttributes.preBuildSyncEnabled.id)}
              render={({ value, onChange, onBlur }) => (
                <TooltipWrapper tooltip={selectedScmRepository && 'Option already set in synced repository.'}>
                  <Switch
                    id={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                    name={scmRepositoryEntityAttributes.preBuildSyncEnabled.id}
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={selectedScmRepository?.preBuildSyncEnabled || value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isDisabled={!!selectedScmRepository}
                  />
                </TooltipWrapper>
              )}
            />
          </FormGroup>

          {getFieldState(scmRepositoryEntityAttributes.scmUrl.id) === 'success' && (
            <ServiceContainerLoading
              title="SCM Repository"
              emptyContent={<ScmRepositoryUrlAlert variant="not-synced" {...selectedScmRepository} />}
              {...serviceContainerScmRepositories}
            >
              <ScmRepositoryUrlAlert variant="synced" {...selectedScmRepository} />
            </ServiceContainerLoading>
          )}
        </Form>
      </ContentBox>

      <ContentBox marginBottom background={false} shadow={false}>
        <ExpandableSection
          title="Product Version"
          isExpanded={showProductVersionSection}
          onToggle={(isExpanded) => setShowProductVersionSection(isExpanded)}
        >
          <ContentBox padding>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormGroup label={`Product ${productEntityAttributes.name.title}`} fieldId={productEntityAttributes.name.id}>
                <SearchSelect
                  selectedItem={selectedProduct?.name}
                  onSelect={(_, product: Product) => {
                    setSelectedProduct(product);
                    productVersionRegisterObject.onChange('');
                    setSelectedProductVersion(undefined);
                  }}
                  onClear={() => {
                    setSelectedProduct(undefined);
                    productVersionRegisterObject.onChange('');
                    setSelectedProductVersion(undefined);
                  }}
                  fetchCallback={productApi.getProducts}
                  titleAttribute="name"
                  placeholderText="Select Product"
                />
              </FormGroup>

              <FormGroup
                isRequired={!!selectedProduct}
                label={buildConfigEntityAttributes.productVersion.title}
                fieldId={buildConfigEntityAttributes.productVersion.id}
                helperText={
                  <FormHelperText isHidden={!selectedProduct || !!selectedProductVersion} isError>
                    Field must be filled.
                  </FormHelperText>
                }
              >
                <FormInput<string>
                  {...productVersionRegisterObject}
                  render={({ value, validated, onChange }) => (
                    <SearchSelect
                      selectedItem={value}
                      validated={validated}
                      onSelect={(_, productVersion: ProductVersion) => {
                        onChange(productVersion.version);
                        setSelectedProductVersion(productVersion);
                      }}
                      onClear={() => {
                        onChange('');
                        setSelectedProductVersion(undefined);
                      }}
                      fetchCallback={fetchProductVersions}
                      titleAttribute="version"
                      placeholderText="Select Version"
                      isDisabled={!selectedProduct}
                    />
                  )}
                />
              </FormGroup>
            </Form>
          </ContentBox>
        </ExpandableSection>
      </ContentBox>

      <ContentBox marginBottom background={false} shadow={false}>
        <ExpandableSection
          title="Build parameters"
          isExpanded={showBuildParametersSection}
          onToggle={(isExpanded) => setShowBuildParametersSection(isExpanded)}
        >
          <ContentBox padding>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <ServiceContainerLoading {...serviceContainerParameters} title="Build parameters" variant="inline">
                <InputGroup>
                  <CreatableSelect
                    onSelect={(_, selection) => {
                      if (selection) {
                        setSelectedBuildParamOption(selection as string);
                        setBuildParamData({
                          ...buildParamData,
                          [selection as string]: {
                            value: '',
                            description: buildParamOptions.find((option) => option.title === selection)?.description,
                          },
                        });
                        setIsBuildParamSelectOpen(false);
                      }
                    }}
                    onCreateOption={(newOption) => {
                      setSelectedBuildParamOption(undefined);
                      setBuildParamOptions([...buildParamOptions, { title: newOption }]);
                      setBuildParamData({
                        ...buildParamData,
                        [newOption]: {
                          value: '',
                        },
                      });
                      setIsBuildParamSelectOpen(false);
                    }}
                    onToggle={setIsBuildParamSelectOpen}
                    selectedItem={selectedBuildParamOption}
                    isOpen={isBuildParamSelectOpen}
                    placeholderText="Select Parameter or type a new one"
                    creatableOptionText="Create custom Parameter"
                    width="40%"
                    dropdownDirection="up"
                  >
                    {buildParamOptions.map((option, index) => (
                      <SelectOption
                        key={index}
                        value={option.title}
                        description={option.description}
                        isDisabled={!!buildParamData[option.title]}
                      />
                    ))}
                  </CreatableSelect>
                </InputGroup>
              </ServiceContainerLoading>

              {Object.entries(buildParamData).map(([key, buildParam], index) => (
                <FormInput<string>
                  {...register(key, { isRequired: true })}
                  render={({ onChange, onRemove, ...rest }) => (
                    <FormGroup
                      isRequired
                      key={index}
                      label={
                        <>
                          <TooltipWrapper tooltip="Remove the parameter">
                            <RemoveItemButton
                              onRemove={() => {
                                setBuildParamData(Object.fromEntries(Object.entries(buildParamData).filter(([k]) => k !== key)));
                                onRemove();
                              }}
                            />
                          </TooltipWrapper>
                          {key}
                        </>
                      }
                      fieldId={key}
                      helperText={
                        <FormHelperText isHidden={getFieldState(key) !== 'error'} isError>
                          {getFieldErrors(key)}
                        </FormHelperText>
                      }
                    >
                      <FormHelperText isHidden={!buildParam.description}>
                        <HelperText>
                          <HelperTextItem>{buildParam.description}</HelperTextItem>
                        </HelperText>
                      </FormHelperText>

                      {key === 'BUILD_CATEGORY' ? (
                        <Select
                          menuAppendTo="parent"
                          id={key}
                          name={key}
                          variant="single"
                          isOpen={isBuildCategorySelectOpen}
                          selections={rest.value || undefined}
                          validated={rest.validated}
                          onToggle={setIsBuildCategorySelectOpen}
                          onSelect={(_, buildCategory, isPlaceholder) => {
                            if (!isPlaceholder) {
                              onChange(buildCategory as string);
                              setIsBuildCategorySelectOpen(false);
                            }
                          }}
                          onBlur={rest.onBlur}
                          hasPlaceholderStyle
                          placeholderText="Select Build category"
                        >
                          <SelectOption value="STANDARD">STANDARD</SelectOption>
                          <SelectOption value="SERVICE">SERVICE</SelectOption>
                        </Select>
                      ) : (
                        <TextArea
                          isRequired
                          id={key}
                          name={key}
                          autoResize
                          resizeOrientation="vertical"
                          onChange={(value) => {
                            setBuildParamData({ ...buildParamData, [key]: { ...buildParamData[key], value } });
                            onChange(value);
                          }}
                          {...rest}
                        />
                      )}
                    </FormGroup>
                  )}
                />
              ))}
            </Form>
          </ContentBox>
        </ExpandableSection>
      </ContentBox>

      <ContentBox marginBottom background={false} shadow={false}>
        <ExpandableSection
          title="Dependencies"
          isExpanded={showDependenciesSection}
          onToggle={(isExpanded) => setShowDependenciesSection(isExpanded)}
        >
          <Grid hasGutter>
            <GridItem lg={12} xl2={6}>
              <Toolbar borderBottom>
                <ToolbarItem>
                  <TextContent>
                    <Text component="h2">Add Build Config dependencies</Text>
                  </TextContent>
                </ToolbarItem>
              </Toolbar>
              <ConfigsAddList<BuildConfiguration>
                variant="Build"
                serviceContainerConfigs={serviceContainerProjectBuildConfigs}
                componentId={componentIdBuildConfigs}
                onConfigAdd={(buildConfig: BuildConfiguration) => {
                  insertBuildConfigChange(buildConfig, 'add');
                }}
                addedConfigs={addedBuildConfigs}
              />
            </GridItem>

            <GridItem lg={12} xl2={6}>
              <Toolbar>
                <ToolbarItem>
                  <TextContent>
                    <Text component="h2">Dependencies to be added</Text>
                  </TextContent>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      toggleCancelAllModal();
                    }}
                    isDisabled={!buildConfigChanges.length}
                  >
                    Cancel all
                  </Button>
                </ToolbarItem>
              </Toolbar>
              <ConfigsChangesList<BuildConfiguration>
                variant="Build"
                configChanges={buildConfigChanges}
                onCancel={(buildConfig: BuildConfiguration) => {
                  cancelBuildConfigChange(buildConfig);
                }}
              />
            </GridItem>
          </Grid>
        </ExpandableSection>
      </ContentBox>

      <ActionGroup>
        <Button
          variant="primary"
          isDisabled={isSubmitDisabled || (selectedProduct && !selectedProductVersion) || serviceContainerScmRepositories.loading}
          onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}
        >
          {isEditPage ? PageTitles.buildConfigEdit : PageTitles.buildConfigCreate}
        </Button>
      </ActionGroup>

      {isCancelAllModalOpen && (
        <ActionConfirmModal
          title="Cancel all changes?"
          actionTitle="Cancel all"
          cancelTitle="Keep the changes"
          isOpen={isCancelAllModalOpen}
          onToggle={toggleCancelAllModal}
          onSubmit={() => {
            cancelAllBuildConfigChanges();
            toggleCancelAllModal();
          }}
        >
          All changes made will be forgotten.
        </ActionConfirmModal>
      )}
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
