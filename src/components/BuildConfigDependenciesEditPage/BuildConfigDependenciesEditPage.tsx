import { Button, Grid, GridItem, Icon, List, ListItem } from '@patternfly/react-core';
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
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';

import { createArrayPatchSimple } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IBuildConfigDependenciesEditPageProps {
  componentIdBuildConfigDependencies?: string;
  componentIdBuildConfigs?: string;
}

export const BuildConfigDependenciesEditPage = ({
  componentIdBuildConfigDependencies = 'd1',
  componentIdBuildConfigs = 'b1',
}: IBuildConfigDependenciesEditPageProps) => {
  const { buildConfigId } = useParamsRequired();

  const navigate = useNavigate();

  const serviceContainerBuildConfig = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerBuildConfigRunner = serviceContainerBuildConfig.run;

  const serviceContainerBuildConfigDependencies = useServiceContainer(buildConfigApi.getDependencies);
  const serviceContainerBuildConfigDependenciesRunner = serviceContainerBuildConfigDependencies.run;

  const serviceContainerBuildConfigs = useServiceContainer(buildConfigApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  const serviceContainerBuildConfigEdit = useServiceContainer(buildConfigApi.patchBuildConfig, 0);

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
    serviceContainerBuildConfigRunner({ serviceData: { id: buildConfigId } });
  }, [serviceContainerBuildConfigRunner, buildConfigId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerBuildConfigDependenciesRunner({ serviceData: { id: buildConfigId }, requestConfig }),
      [serviceContainerBuildConfigDependenciesRunner, buildConfigId]
    ),
    { componentId: componentIdBuildConfigDependencies }
  );

  useQueryParamsEffect(serviceContainerBuildConfigsRunner, { componentId: componentIdBuildConfigs });

  useTitle(
    generatePageTitle({
      pageType: 'Edit',
      serviceContainer: serviceContainerBuildConfig,
      firstLevelEntity: 'Build Config',
      entityName: `Build Config dependencies of ${serviceContainerBuildConfig.data?.name}`,
    })
  );

  return (
    <PageLayout
      title={
        PageTitles.buildConfigAddRemoveDependencies +
        `${serviceContainerBuildConfig.data?.name ? ' in ' + serviceContainerBuildConfig.data.name : ''}`
      }
      breadcrumbs={[
        { entity: breadcrumbData.buildConfig.id, title: serviceContainerBuildConfig.data?.name, url: '-/dependencies/edit' },
        { entity: breadcrumbData.edit.id, title: PageTitles.buildConfigAddRemoveDependencies, custom: true },
      ]}
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
            size="sm"
            onClick={() => {
              toggleSubmitModal();
            }}
            isDisabled={!buildConfigChanges.length}
          >
            Submit changes
          </Button>
        </>
      }
      description={
        <>
          <div>
            Edit the list of Build Config dependencies by removing existing ones or adding new ones. All the Build Config
            dependencies marked to be removed or added are listed in the Changes Summary section. To submit the changes, use the
            Submit button.
          </div>
        </>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Current Build Config dependencies" />
            </ToolbarItem>
          </Toolbar>

          <ConfigsRemoveList<BuildConfiguration>
            variant="Build"
            serviceContainerConfigs={serviceContainerBuildConfigDependencies}
            componentId={componentIdBuildConfigDependencies}
            onConfigRemove={(buildConfig: BuildConfiguration) => {
              insertBuildConfigChange(buildConfig, 'remove');
            }}
            removedConfigs={removedBuildConfigs}
          />
        </GridItem>

        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Add new Build Config dependencies" />
            </ToolbarItem>
          </Toolbar>

          <ConfigsAddList<BuildConfiguration>
            variant="Build"
            serviceContainerConfigs={serviceContainerBuildConfigs}
            componentId={componentIdBuildConfigs}
            onConfigAdd={(buildConfig: BuildConfiguration) => {
              insertBuildConfigChange(buildConfig, 'add');
            }}
            addedConfigs={addedBuildConfigs}
            buildConfigToExclude={buildConfigId}
            dependenciesToExclude={
              serviceContainerBuildConfig.data?.dependencies && Object.keys(serviceContainerBuildConfig.data.dependencies)
            }
          />
        </GridItem>

        <GridItem span={12}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Changes Summary" />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="tertiary"
                size="sm"
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

            const patchData = createArrayPatchSimple(removedBuildConfigs, addedBuildConfigs, 'dependencies');

            serviceContainerBuildConfigEdit.run({
              serviceData: { id: buildConfigId, patchData },
              onSuccess: () => navigate('../dependencies'),
              onError: () => console.error('Failed to edit Build Config dependencies.'),
            });
          }}
          serviceContainer={serviceContainerBuildConfigEdit}
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
