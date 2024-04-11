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
import { CheckIcon } from '@patternfly/react-icons';
import { Operation } from 'fast-json-patch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BuildConfiguration, Environment, Product, ProductVersion, SCMRepository, SCMRepositoryPage } from 'pnc-api-types-ts';

import { PncError } from 'common/PncError';
import { breadcrumbData } from 'common/breadcrumbData';
import { buildConfigEntityAttributes } from 'common/buildConfigEntityAttributes';
import { buildTypeData } from 'common/buildTypeData';
import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';
import { productEntityAttributes } from 'common/productEntityAttributes';
import { scmRepositoryEntityAttributes } from 'common/scmRepositoryEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { usePatchOperation } from 'hooks/usePatchOperation';
import { hasBuildConfigFailed, hasBuildConfigSucceeded, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { getErrorMessage, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionConfirmModal } from 'components/ActionConfirmModal/ActionConfirmModal';
import { ConfigsAddList } from 'components/ConfigsEditList/ConfigsAddList';
import { ConfigsChangesList } from 'components/ConfigsEditList/ConfigsChangesList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { CreatableSelect } from 'components/CreatableSelect/CreatableSelect';
import { ExpandableSection } from 'components/ExpandableSection/ExpandableSection';
import { FormInput } from 'components/FormInput/FormInput';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { PageLayout } from 'components/PageLayout/PageLayout';
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
import * as productVersionApi from 'services/productVersionApi';
import * as projectApi from 'services/projectApi';
import * as scmRepositoryApi from 'services/scmRepositoryApi';

import { maxLengthValidator255, validateBuildScript, validateScmUrl } from 'utils/formValidationHelpers';
import { createSafePatch } from 'utils/patchHelper';
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
        validator: (fieldValues) => validateBuildScript(fieldValues, { mandatoryCheck: true, forbiddenCheck: true }),
        errorMessage: '',
        relatedFields: ['buildScript'],
      },
    ],
  },
  buildScript: {
    isRequired: true,
    validators: [
      {
        validator: (fieldValues) => validateBuildScript(fieldValues, { mandatoryCheck: true }),
        errorMessage: "The 'deploy' goal is required for maven builds in order to prevent artifact promotion issues.",
        relatedFields: ['buildType'],
      },
      {
        validator: (fieldValues) => validateBuildScript(fieldValues, { forbiddenCheck: true }),
        errorMessage: "The '-X' and '--debug' options are not allowed for Maven builds for performance reasons.",
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
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [buildConfigCreatingLoading, setBuildConfigCreatingLoading] = useState<boolean>(false);
  const [buildConfigCreatingFinished, setBuildConfigCreatingFinished] = useState<BuildConfiguration>();
  const [buildConfigCreatingError, setBuildConfigCreatingError] = useState<string>();

  // create page
  const serviceContainerCreateWithoutScm = useServiceContainer(buildConfigApi.createBuildConfig);
  const serviceContainerCreateWithScm = useServiceContainer(buildConfigApi.createBuildConfigWithScm);
  const serviceContainerCreateWithScmTaskId = serviceContainerCreateWithScm.data?.taskId;

  const serviceContainerProject = useServiceContainer(projectApi.getProject);
  const serviceContainerProjectRunner = serviceContainerProject.run;

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

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const componentIdBuildConfigs = 'bc1';

  const [showProductVersionSection, setShowProductVersionSection] = useState<boolean>(false);
  const [showBuildParametersSection, setShowBuildParametersSection] = useState<boolean>(false);
  const [showDependenciesSection, setShowDependenciesSection] = useState<boolean>(false);

  const { register, unregister, getFieldValue, getFieldState, getFieldErrors, handleSubmit, isSubmitDisabled, setFieldValues } =
    useForm();
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

  // scroll placeholder
  const formComponentRef = useRef<HTMLDivElement>(null);
  const scrollIntoFormErrors = useCallback(() => {
    if (buildConfigCreatingError) {
      formComponentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [buildConfigCreatingError]);

  const {
    operations: buildConfigChanges,
    addedData: addedBuildConfigs,
    insertOperation: insertBuildConfigChange,
    cancelOperation: cancelBuildConfigChange,
    cancelAllOperations: cancelAllBuildConfigChanges,
  } = usePatchOperation<BuildConfiguration>();

  const productVersionRegisterObject = register<string>(buildConfigEntityAttributes.productVersion.id);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildConfigFailed(wsData, { taskId: serviceContainerCreateWithScmTaskId })) {
          setBuildConfigCreatingError(wsData.notificationType);
          setBuildConfigCreatingFinished(undefined);
          setBuildConfigCreatingLoading(false);
        } else if (hasBuildConfigSucceeded(wsData, { taskId: serviceContainerCreateWithScmTaskId })) {
          const buildConfig: BuildConfiguration = wsData.buildConfig;

          setBuildConfigCreatingError(undefined);
          setBuildConfigCreatingFinished(buildConfig);
          setBuildConfigCreatingLoading(false);
        }
      },
      [serviceContainerCreateWithScmTaskId]
    ),
    { preventListening: !serviceContainerCreateWithScmTaskId }
  );

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
    setBuildConfigCreatingLoading(true);

    // reset previous results
    setBuildConfigCreatingError(undefined);
    setBuildConfigCreatingFinished(undefined);

    const buildConfig = {
      project: { id: projectId! },
      name: data.name,
      description: data.description,
      environment: selectedEnvironment,
      buildType: data.buildType,
      buildScript: data.buildScript,
      brewPullActive: data.brewPullActive,
      scmRevision: data.scmRevision,
      productVersion: selectedProductVersion,
      parameters: Object.fromEntries(Object.entries(buildParamData).map(([k, v]) => [k, v.value])),
      dependencies: Object.fromEntries(addedBuildConfigs.map((buildConfig) => [buildConfig.id, buildConfig])),
    } as BuildConfiguration;

    if (selectedScmRepository) {
      return serviceContainerCreateWithoutScm
        .run({
          serviceData: {
            data: { ...buildConfig, scmRepository: selectedScmRepository },
          },
        })
        .then((response) => {
          const newBuildConfig = response?.data;
          if (!newBuildConfig?.id) {
            throw new PncError({
              code: 'NEW_ENTITY_ID_ERROR',
              message: `Invalid buildConfigId coming from Orch POST response: ${newBuildConfig?.id}`,
            });
          }
          setBuildConfigCreatingFinished(newBuildConfig);
        })
        .catch((error) => {
          setBuildConfigCreatingError(getErrorMessage(error));
          throw error;
        })
        .finally(() => {
          setBuildConfigCreatingLoading(false);
        });
    }

    // then() is not required, it's handled using WebSocket
    return serviceContainerCreateWithScm
      .run({
        serviceData: {
          data: { buildConfig, scmUrl: data.scmUrl, preBuildSyncEnabled: data.preBuildSyncEnabled },
        },
      })
      .catch((error) => {
        setBuildConfigCreatingLoading(false);
        setBuildConfigCreatingError(getErrorMessage(error));
        throw error;
      });
  };

  const submitEdit = (data: IFieldValues) => {
    const buildConfig = {
      name: data.name,
      description: data.description,
      environment: selectedEnvironment ? { id: selectedEnvironment.id } : undefined,
      buildType: data.buildType,
      buildScript: data.buildScript,
      brewPullActive: data.buildType !== buildTypeData.NPM.id && !!data.brewPullActive,
      scmRepository: selectedScmRepository ? { id: selectedScmRepository.id } : undefined,
      scmRevision: data.scmRevision,
      productVersion: selectedProductVersion ? { id: selectedProductVersion.id } : undefined,
      parameters: Object.fromEntries(Object.entries(buildParamData).map(([k, v]) => [k, v.value])),
    } as BuildConfiguration;

    const removedParameters: Operation[] = serviceContainerEditPageGet.data!.parameters
      ? Object.keys(serviceContainerEditPageGet.data!.parameters)
          .filter((key) => !buildConfig.parameters?.[key])
          .map((key) => ({ op: 'remove', path: `/parameters/${key}` }))
      : [];
    const patchData = [...createSafePatch(serviceContainerEditPageGet.data!, buildConfig), ...removedParameters];

    return serviceContainerEditPagePatch
      .run({ serviceData: { id: buildConfigId, patchData } })
      .then(() => {
        navigate(`/build-configs/${buildConfigId}`);
      })
      .catch((error) => {
        console.error('Failed to edit Build Config.');
        throw error;
      });
  };

  useEffect(() => {
    if (!isEditPage && projectId) {
      serviceContainerProjectRunner({ serviceData: { id: projectId } });
    }
    if (isEditPage) {
      serviceContainerEditPageGetRunner({ serviceData: { id: buildConfigId } }).then((response) => {
        const buildConfig = response.data;
        const buildConfigFlat = {
          ...buildConfig,
          environment: buildConfig.environment?.description,
          scmUrl: buildConfig.scmRepository?.internalUrl,
          productVersion: buildConfig.productVersion?.version,
          ...buildConfig.parameters,
        };

        setSelectedEnvironment(buildConfig.environment);
        setSelectedScmRepository(buildConfig.scmRepository);
        if (buildConfig.parameters) {
          setBuildParamData(Object.fromEntries(Object.entries(buildConfig.parameters).map(([k, v]) => [k, { value: v }])));
        }
        setFieldValues(buildConfigFlat);

        if (buildConfig.productVersion) {
          serviceContainerProductVersionRunner({ serviceData: { id: buildConfig.productVersion.id } }).then((response) => {
            const productVersion: ProductVersion = response.data;

            setSelectedProductVersion(productVersion);
            setSelectedProduct(productVersion.product);
          });
        }
      });
    }
  }, [
    isEditPage,
    buildConfigId,
    projectId,
    serviceContainerEditPageGetRunner,
    serviceContainerProductVersionRunner,
    serviceContainerProjectRunner,
    setFieldValues,
  ]);

  useEffect(() => {
    serviceContainerParametersRunner().then((response) => {
      setBuildParamOptions(response.data?.map((parameter) => ({ title: parameter.name!, description: parameter.description })));
    });
  }, [serviceContainerParametersRunner]);

  useQueryParamsEffect(serviceContainerProjectBuildConfigsRunner, { componentId: componentIdBuildConfigs });

  // async scroll after buildConfigCreatingError is successfully set
  useEffect(() => {
    scrollIntoFormErrors();
  }, [scrollIntoFormErrors]);

  const productSearchSelect = (
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
  );

  const productVersionSearchSelect = (
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
  );

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
            <TextArea
              id={buildConfigEntityAttributes.buildScript.id}
              name={buildConfigEntityAttributes.buildScript.id}
              autoResize
              resizeOrientation="vertical"
              {...register<string>(buildConfigEntityAttributes.buildScript.id, fieldConfigs.buildScript)}
            />
          </FormGroup>

          <FormGroup
            label={buildConfigEntityAttributes.brewPullActive.title}
            fieldId={buildConfigEntityAttributes.brewPullActive.id}
            labelIcon={<TooltipWrapper tooltip={buildConfigEntityAttributes.brewPullActive.tooltip} />}
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
            labelIcon={
              <TooltipWrapper
                tooltip={
                  isEditPage ? scmRepositoryEntityAttributes.internalUrl.tooltip : scmRepositoryEntityAttributes.scmUrl.tooltip
                }
              />
            }
            helperText={
              <FormHelperText isHidden={getFieldState(scmRepositoryEntityAttributes.scmUrl.id) !== 'error'} isError>
                {getFieldErrors(scmRepositoryEntityAttributes.scmUrl.id)}
              </FormHelperText>
            }
          >
            {!isEditPage && (
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
            )}

            {isEditPage && (
              <FormInput<string>
                {...register<string>(scmRepositoryEntityAttributes.scmUrl.id, fieldConfigs.scmUrl)}
                render={({ value, validated, onChange }) => (
                  <SearchSelect
                    selectedItem={value}
                    validated={validated}
                    onSelect={(_, scmRepository: SCMRepository) => {
                      onChange(scmRepository.internalUrl!);
                      setSelectedScmRepository(scmRepository);
                    }}
                    onClear={() => {
                      onChange('');
                      setSelectedScmRepository(undefined);
                    }}
                    fetchCallback={scmRepositoryApi.getScmRepositories}
                    titleAttribute="internalUrl"
                    placeholderText="Select SCM Repository"
                  />
                )}
              />
            )}
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

          {!isEditPage && (
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
          )}

          {!isEditPage && getFieldState(scmRepositoryEntityAttributes.scmUrl.id) === 'success' && (
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
                label={buildConfigEntityAttributes.productVersion.title}
                fieldId={buildConfigEntityAttributes.productVersion.id}
                helperText={
                  <FormHelperText isHidden={!selectedProduct || !!selectedProductVersion} isError>
                    Field must be filled.
                  </FormHelperText>
                }
              >
                {serviceContainerEditPageGet.data?.productVersion ? (
                  <ServiceContainerLoading
                    {...serviceContainerProductVersion}
                    variant="inline"
                    title={buildConfigEntityAttributes.productVersion.title}
                  >
                    {productVersionSearchSelect}
                  </ServiceContainerLoading>
                ) : (
                  productVersionSearchSelect
                )}
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
                  render={({ onChange, ...rest }) => (
                    <FormGroup
                      isRequired
                      key={index}
                      label={
                        <>
                          <TooltipWrapper tooltip="Remove the parameter">
                            <RemoveItemButton
                              onRemove={() => {
                                setBuildParamData(Object.fromEntries(Object.entries(buildParamData).filter(([k]) => k !== key)));
                                unregister(key);
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
                              setBuildParamData({
                                ...buildParamData,
                                [key]: { ...buildParamData[key], value: buildCategory as string },
                              });
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
                          height={150}
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

      {!isEditPage && (
        <ContentBox background={false} shadow={false}>
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
      )}

      <Form>
        <ActionGroup>
          <Button
            variant="primary"
            isDisabled={
              isSubmitDisabled || (selectedProduct && !selectedProductVersion) || serviceContainerScmRepositories.loading
            }
            onClick={handleSubmit(isEditPage ? submitEdit : submitCreate)}
          >
            {isEditPage ? ButtonTitles.update : ButtonTitles.create} {EntityTitles.buildConfig}
          </Button>

          {buildConfigCreatingLoading && (
            <p className="p-6 p-l-10">
              This operation may take several minutes <LoadingSpinner isInline />
            </p>
          )}

          {buildConfigCreatingError && (
            <p className="p-6 p-l-10">
              <ExclamationTriangleIcon color="#F0AB00" /> Operation was not successful,{' '}
              <Button
                variant="link"
                isInline
                onClick={() => {
                  scrollIntoFormErrors();
                }}
              >
                see details above
              </Button>
            </p>
          )}

          {buildConfigCreatingFinished && (
            <Button
              variant="secondary"
              component={(props) => <Link {...props} to={`/build-configs/${buildConfigCreatingFinished.id}`} />}
            >
              <CheckIcon /> {ButtonTitles.view} {EntityTitles.buildConfig}
            </Button>
          )}
        </ActionGroup>
      </Form>

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
      breadcrumbs={
        isEditPage
          ? [
              { entity: breadcrumbData.buildConfig.id, title: serviceContainerEditPageGet.data?.name, url: '-/edit' },
              { entity: breadcrumbData.edit.id, title: PageTitles.buildConfigEdit, custom: true },
            ]
          : [
              {
                entity: breadcrumbData.project.id,
                title: serviceContainerProject.data?.name,
                url: '-/build-configs/create',
              },
              { entity: breadcrumbData.create.id, title: PageTitles.buildConfigCreate, custom: true },
            ]
      }
      description={
        isEditPage ? <>You can update current Build Config attributes below.</> : <>You can create a new Build Config.</>
      }
    >
      <div ref={formComponentRef} className="scroll-margin">
        {/* scroll placeholder */}
      </div>
      {isEditPage ? (
        <ServiceContainerCreatingUpdating
          {...serviceContainerEditPagePatch}
          serviceContainerLoading={serviceContainerEditPageGet}
          title="Build Config"
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      ) : (
        <ServiceContainerCreatingUpdating
          data={buildConfigCreatingFinished}
          loading={buildConfigCreatingLoading}
          error={buildConfigCreatingError || ''}
        >
          {formComponent}
        </ServiceContainerCreatingUpdating>
      )}
    </PageLayout>
  );
};
