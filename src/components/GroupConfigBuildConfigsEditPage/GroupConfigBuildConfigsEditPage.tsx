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
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildConfigApi from 'services/buildConfigApi';
import * as groupConfigApi from 'services/groupConfigApi';

import { createArrayPatchSimple } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IGroupConfigBuildConfigsEditPageProps {
  componentIdGroupConfigBuildConfigs?: string;
  componentIdBuildConfigs?: string;
}

export const GroupConfigBuildConfigsEditPage = ({
  componentIdGroupConfigBuildConfigs = 'g1',
  componentIdBuildConfigs = 'p1',
}: IGroupConfigBuildConfigsEditPageProps) => {
  const { groupConfigId } = useParamsRequired();

  const navigate = useNavigate();

  const serviceContainerGroupConfig = useServiceContainer(groupConfigApi.getGroupConfig);
  const serviceContainerGroupConfigRunner = serviceContainerGroupConfig.run;

  const serviceContainerGroupConfigBuildConfigs = useServiceContainer(groupConfigApi.getBuildConfigs);
  const serviceContainerGroupConfigBuildConfigsRunner = serviceContainerGroupConfigBuildConfigs.run;

  const serviceContainerBuildConfigs = useServiceContainer(buildConfigApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  const serviceContainerGroupConfigPatch = useServiceContainer(groupConfigApi.patchGroupConfig);
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
    serviceContainerGroupConfigRunner({ serviceData: { id: groupConfigId } });
  }, [serviceContainerGroupConfigRunner, groupConfigId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) =>
        serviceContainerGroupConfigBuildConfigsRunner({ serviceData: { id: groupConfigId }, requestConfig }),
      [serviceContainerGroupConfigBuildConfigsRunner, groupConfigId]
    ),
    { componentId: componentIdGroupConfigBuildConfigs }
  );

  useQueryParamsEffect(serviceContainerBuildConfigsRunner, { componentId: componentIdBuildConfigs });

  useTitle(
    generatePageTitle({
      pageType: 'Edit',
      serviceContainer: serviceContainerGroupConfig,
      firstLevelEntity: 'Group Config',
      entityName: `Build Configs of ${serviceContainerGroupConfig.data?.name}`,
    })
  );

  return (
    <PageLayout
      title={
        PageTitles.buildConfigAddRemove +
        `${serviceContainerGroupConfig.data?.name ? ' in ' + serviceContainerGroupConfig.data.name : ''}`
      }
      breadcrumbs={[
        { entity: breadcrumbData.groupConfig.id, title: serviceContainerGroupConfig.data?.name, url: '-/build-configs/edit' },
        { entity: breadcrumbData.edit.id, title: PageTitles.buildConfigAddRemove, custom: true },
      ]}
      actions={
        <div className="page-header__submit-button">
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
          <div className={css(!buildConfigChanges.length && 'visibility-hidden')}>
            <Icon status="warning">
              <ExclamationTriangleIcon />
            </Icon>{' '}
            Submit the changes to apply them
          </div>
        </div>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader title="Build Configs currently in the Group Config" />
            </ToolbarItem>
          </Toolbar>

          <ConfigsRemoveList<BuildConfiguration>
            variant="Build"
            serviceContainerConfigs={serviceContainerGroupConfigBuildConfigs}
            componentId={componentIdGroupConfigBuildConfigs}
            onConfigRemove={(buildConfig: BuildConfiguration) => {
              insertBuildConfigChange(buildConfig, 'remove');
            }}
            removedConfigs={removedBuildConfigs}
          />
        </GridItem>

        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <PageSectionHeader
                title={
                  <>
                    Add new Build Configs{' '}
                    <TooltipWrapper tooltip="Both unassigned Build Configs and those assigned to another Group Config are displayed since Build Configs can belong to multiple Group Configs." />
                  </>
                }
              />
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
            groupConfigToExclude={groupConfigId}
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

            const patchData = createArrayPatchSimple(removedBuildConfigs, addedBuildConfigs, 'buildConfigs');

            return serviceContainerGroupConfigPatch.run({
              serviceData: { id: groupConfigId, patchData },
              onSuccess: () => navigate('..'),
              onError: () => console.error('Failed to edit Group Config Build Configs.'),
            });
          }}
          serviceContainer={serviceContainerGroupConfigPatch}
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
