import { Button, Grid, GridItem, List, ListItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    ({ requestConfig } = {}) =>
      serviceContainerGroupConfigBuildConfigsRunner({ serviceData: { id: groupConfigId }, requestConfig }),
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
        <>
          <div className={css(!buildConfigChanges.length && 'visibility-hidden')}>
            <ExclamationTriangleIcon color="#F0AB00" /> Submit the changes to apply them
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
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Build Configs currently in the Group Config</Text>
              </TextContent>
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
          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>
                  Add new Build Configs{' '}
                  <TooltipWrapper tooltip="Both unassigned Build Configs and those assigned to another Group Config are displayed since Build Configs can belong to multiple Group Configs." />
                </Text>
              </TextContent>
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
              <TextContent>
                <Text component={TextVariants.h2}>Changes Summary</Text>
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

      {isSubmitModalOpen && (
        <ActionConfirmModal
          title="Submit changes?"
          isOpen={isSubmitModalOpen}
          wereSubmitDataChanged={wereBuildConfigsChanged}
          onToggle={toggleSubmitModal}
          onSubmit={() => {
            setWereBuildConfigsChanged(false);

            const patchData = createArrayPatchSimple(removedBuildConfigs, addedBuildConfigs, 'buildConfigs');

            serviceContainerGroupConfigPatch
              .run({ serviceData: { id: groupConfigId, patchData } })
              .then(() => {
                navigate('..');
              })
              .catch(() => {
                console.error('Failed to edit Group Config Build Configs.');
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
