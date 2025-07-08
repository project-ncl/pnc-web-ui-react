import { Button, Content, ContentVariants, Grid, GridItem, Icon, List, ListItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { breadcrumbData } from 'common/breadcrumbData';
import { PageTitles } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { usePatchOperation } from 'hooks/usePatchOperation';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionConfirmModal } from 'components/ActionConfirmModal/ActionConfirmModal';
import { ConfigsAddList } from 'components/ConfigsEditList/ConfigsAddList';
import { ConfigsChangesList } from 'components/ConfigsEditList/ConfigsChangesList';
import { ConfigsRemoveList } from 'components/ConfigsEditList/ConfigsRemoveList';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildConfigApi from 'services/buildConfigApi';
import * as productVersionApi from 'services/productVersionApi';

import { createArrayPatchSimple } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IProductVersionBuildConfigsEditPageProps {
  componentIdProductVersionBuildConfigs?: string;
  componentIdProjectBuildConfigs?: string;
}

export const ProductVersionBuildConfigsEditPage = ({
  componentIdProductVersionBuildConfigs = 'v1',
  componentIdProjectBuildConfigs = 'p1',
}: IProductVersionBuildConfigsEditPageProps) => {
  const { productVersionId } = useParamsRequired();

  const navigate = useNavigate();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerProductVersionBuildConfigs = useServiceContainer(productVersionApi.getBuildConfigs);
  const serviceContainerProductVersionBuildConfigsRunner = serviceContainerProductVersionBuildConfigs.run;

  const serviceContainerProjectBuildConfigs = useServiceContainer(buildConfigApi.getBuildConfigs);
  const serviceContainerProjectBuildConfigsRunner = serviceContainerProjectBuildConfigs.run;

  const serviceContainerProductVersionPatch = useServiceContainer(productVersionApi.patchProductVersion, 0);

  const productVersion = serviceContainerProductVersion.data
    ? `${serviceContainerProductVersion.data?.product?.name} ${serviceContainerProductVersion.data?.version}`
    : '';

  const [wereBuildConfigsChanged, setWereBuildConfigsChanged] = useState<boolean>(false);

  const {
    operations: buildConfigChanges,
    removedData: removedBuildConfigs,
    addedData: addedBuildConfigs,
    insertOperation: insertBuildConfigChange,
    cancelOperation: cancelBuildConfigChange,
    cancelAllOperations: cancelAllBuildConfigChanges,
  } = usePatchOperation<BuildConfiguration>();

  useEffect(() => {
    if (buildConfigChanges.length) {
      setWereBuildConfigsChanged(true);
    }
  }, [buildConfigChanges.length]);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const toggleSubmitModal = () => setIsSubmitModalOpen((isSubmitModalOpen) => !isSubmitModalOpen);

  const [isCancelAllModalOpen, setIsCancelAllModalOpen] = useState<boolean>(false);
  const toggleCancelAllModal = () => setIsCancelAllModalOpen((isCancelAllModalOpen) => !isCancelAllModalOpen);

  useEffect(() => {
    serviceContainerProductVersionRunner({ serviceData: { id: productVersionId } });
  }, [serviceContainerProductVersionRunner, productVersionId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerProductVersionBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerProductVersionBuildConfigsRunner, productVersionId]
    ),
    { componentId: componentIdProductVersionBuildConfigs }
  );

  useQueryParamsEffect(serviceContainerProjectBuildConfigsRunner, { componentId: componentIdProjectBuildConfigs });

  useTitle(
    generatePageTitle({
      pageType: 'Edit',
      serviceContainer: serviceContainerProductVersion,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: [
        `Build Configs of ${serviceContainerProductVersion.data?.version ?? 'Version'}`,
        serviceContainerProductVersion.data?.product?.name,
      ],
    })
  );

  return (
    <PageLayout
      title={`Add and remove Build Configs${productVersion ? ' in ' + productVersion : ''}`}
      actions={
        <>
          <div className={css(!buildConfigChanges.length && 'visibility-hidden')}>
            <Icon status="warning">
              <ExclamationTriangleIcon />
            </Icon>{' '}
            Submit the changes to apply them
          </div>
          <Button
            key="submit-btn"
            variant="primary"
            onClick={() => {
              toggleSubmitModal();
            }}
            isDisabled={!buildConfigChanges.length}
          >
            Submit changes
          </Button>
        </>
      }
      breadcrumbs={[
        { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
        { entity: breadcrumbData.productVersion.id, title: serviceContainerProductVersion.data?.version },
        { entity: breadcrumbData.buildConfigs.id, title: PageTitles.buildConfigEdit },
      ]}
      description={
        <>
          <div>
            Edit the list of Build Configs associated with the Version by removing existing ones or adding new ones. All the Build
            Configs marked to be removed or added are listed in the Changes Summary section. To submit the changes, use the Submit
            button.
          </div>
        </>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar borderBottom>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>Build Configs currently in the Version</Content>
            </ToolbarItem>
          </Toolbar>

          <ConfigsRemoveList<BuildConfiguration>
            variant="Build"
            serviceContainerConfigs={serviceContainerProductVersionBuildConfigs}
            componentId={componentIdProductVersionBuildConfigs}
            onConfigRemove={(buildConfig: BuildConfiguration) => {
              insertBuildConfigChange(buildConfig, 'remove');
            }}
            removedConfigs={removedBuildConfigs}
          />
        </GridItem>

        <GridItem lg={12} xl2={6}>
          <Toolbar borderBottom>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>
                Add new Build Configs{' '}
                <TooltipWrapper tooltip="Both unassigned Build Configs and those assigned to another Version are displayed. If you add assigned Build Config, it will be removed from its original Version." />
              </Content>
            </ToolbarItem>
          </Toolbar>

          <ConfigsAddList<BuildConfiguration>
            variant="Build"
            serviceContainerConfigs={serviceContainerProjectBuildConfigs}
            componentId={componentIdProjectBuildConfigs}
            onConfigAdd={(buildConfig: BuildConfiguration) => {
              insertBuildConfigChange(buildConfig, 'add');
            }}
            addedConfigs={addedBuildConfigs}
            productVersionToExclude={productVersionId}
          />
        </GridItem>

        <GridItem span={12}>
          <Toolbar>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>Changes Summary</Content>
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

      {isSubmitModalOpen && (
        <ActionConfirmModal
          title="Submit changes?"
          isOpen={isSubmitModalOpen}
          wereSubmitDataChanged={wereBuildConfigsChanged}
          onToggle={toggleSubmitModal}
          onSubmit={() => {
            setWereBuildConfigsChanged(false);

            const patchData = createArrayPatchSimple(removedBuildConfigs, addedBuildConfigs, 'buildConfigs');

            return serviceContainerProductVersionPatch.run({
              serviceData: { id: productVersionId, patchData },
              onSuccess: () => navigate('../build-configs'),
              onError: () => console.error('Failed to edit Product Version Build Configs.'),
            });
          }}
          serviceContainer={serviceContainerProductVersionPatch}
        >
          <List>
            {!!removedBuildConfigs.length && (
              <ListItem>
                {removedBuildConfigs.length} Build Config{removedBuildConfigs.length > 1 && 's'} to be removed.
              </ListItem>
            )}
            {!!addedBuildConfigs.length && (
              <ListItem>
                {addedBuildConfigs.length} Build Config{addedBuildConfigs.length > 1 && 's'} to be added.
              </ListItem>
            )}
          </List>
        </ActionConfirmModal>
      )}

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
    </PageLayout>
  );
};
