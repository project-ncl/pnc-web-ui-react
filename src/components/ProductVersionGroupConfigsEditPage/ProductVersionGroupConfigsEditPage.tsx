import { Button, Content, ContentVariants, Grid, GridItem, Icon, List, ListItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { GroupConfiguration } from 'pnc-api-types-ts';

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
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as groupConfigApi from 'services/groupConfigApi';
import * as productVersionApi from 'services/productVersionApi';

import { createArrayPatchSimple } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

interface IProductVersionBuildConfigsEditPageProps {
  componentIdProductVersionGroupConfigs?: string;
  componentIdGroupConfigs?: string;
}

export const ProductVersionGroupConfigsEditPage = ({
  componentIdProductVersionGroupConfigs = 'v1',
  componentIdGroupConfigs = 'o1',
}: IProductVersionBuildConfigsEditPageProps) => {
  const { productVersionId } = useParamsRequired();

  const navigate = useNavigate();

  const serviceContainerProductVersion = useServiceContainer(productVersionApi.getProductVersion);
  const serviceContainerProductVersionRunner = serviceContainerProductVersion.run;

  const serviceContainerProductVersionGroupConfigs = useServiceContainer(productVersionApi.getGroupConfigs);
  const serviceContainerProductVersionGroupConfigsRunner = serviceContainerProductVersionGroupConfigs.run;

  const serviceContainerGroupConfigs = useServiceContainer(groupConfigApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  const serviceContainerProductVersionPatch = useServiceContainer(productVersionApi.patchProductVersion, 0);

  const productVersion = serviceContainerProductVersion.data
    ? `${serviceContainerProductVersion.data?.product?.name} ${serviceContainerProductVersion.data?.version}`
    : '';

  const {
    operations: groupConfigChanges,
    removedData: removedGroupConfigs,
    addedData: addedGroupConfigs,
    insertOperation: insertGroupConfigChange,
    cancelOperation: cancelGroupConfigChange,
    cancelAllOperations: cancelAllGroupConfigChanges,
  } = usePatchOperation<GroupConfiguration>();

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
        serviceContainerProductVersionGroupConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerProductVersionGroupConfigsRunner, productVersionId]
    ),
    { componentId: componentIdProductVersionGroupConfigs }
  );

  useQueryParamsEffect(serviceContainerGroupConfigsRunner, { componentId: componentIdGroupConfigs });

  useTitle(
    generatePageTitle({
      pageType: 'Edit',
      serviceContainer: serviceContainerProductVersion,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: [
        `Group Configs of ${serviceContainerProductVersion.data?.version ?? 'Version'}`,
        serviceContainerProductVersion.data?.product?.name,
      ],
    })
  );

  return (
    <PageLayout
      title={`Add and remove Group Configs${productVersion ? ' in ' + productVersion : ''}`}
      actions={
        <>
          <div className={css(!groupConfigChanges.length && 'visibility-hidden')}>
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
            isDisabled={!groupConfigChanges.length}
          >
            Submit changes
          </Button>
        </>
      }
      breadcrumbs={[
        { entity: breadcrumbData.product.id, title: serviceContainerProductVersion.data?.product?.name },
        { entity: breadcrumbData.productVersion.id, title: serviceContainerProductVersion.data?.version },
        { entity: breadcrumbData.groupConfigs.id, title: PageTitles.groupConfigEdit },
      ]}
      description={
        <>
          <div>
            Edit the list of Group Configs associated with the Version by removing existing ones or adding new ones. All the Group
            Configs marked to be removed or added are listed in the Changes Summary section. To submit the changes, use the Submit
            button.
          </div>
        </>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>Group Configs currently in the Version</Content>
            </ToolbarItem>
          </Toolbar>
          <ContentBox borderTop>
            <ConfigsRemoveList<GroupConfiguration>
              variant="Group Build"
              serviceContainerConfigs={serviceContainerProductVersionGroupConfigs}
              componentId={componentIdProductVersionGroupConfigs}
              onConfigRemove={(groupConfig: GroupConfiguration) => {
                insertGroupConfigChange(groupConfig, 'remove');
              }}
              removedConfigs={removedGroupConfigs}
            />
          </ContentBox>
        </GridItem>

        <GridItem lg={12} xl2={6}>
          <Toolbar>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>
                Add new Group Configs{' '}
                <TooltipWrapper tooltip="Only unassigned Group Configs are displayed. If you want to add Group Config already assigned to another Version, remove it from that Version first." />
              </Content>
            </ToolbarItem>
          </Toolbar>
          <ContentBox borderTop>
            <ConfigsAddList<GroupConfiguration>
              variant="Group Build"
              serviceContainerConfigs={serviceContainerGroupConfigs}
              componentId={componentIdGroupConfigs}
              onConfigAdd={(groupConfig: GroupConfiguration) => {
                insertGroupConfigChange(groupConfig, 'add');
              }}
              addedConfigs={addedGroupConfigs}
              productVersionToExclude={productVersionId!}
            />
          </ContentBox>
        </GridItem>

        <GridItem span={12}>
          <ServiceContainerCreatingUpdating {...serviceContainerProductVersionPatch}>
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
                  isDisabled={!groupConfigChanges.length}
                >
                  Cancel all
                </Button>
              </ToolbarItem>
            </Toolbar>
            <ConfigsChangesList<GroupConfiguration>
              variant="Build"
              configChanges={groupConfigChanges}
              onCancel={(groupConfig: GroupConfiguration) => {
                cancelGroupConfigChange(groupConfig);
              }}
            />
          </ServiceContainerCreatingUpdating>
        </GridItem>
      </Grid>

      {isSubmitModalOpen && (
        <ActionConfirmModal
          title="Submit changes?"
          isOpen={isSubmitModalOpen}
          onToggle={toggleSubmitModal}
          onSubmit={() => {
            const patchData = createArrayPatchSimple(removedGroupConfigs, addedGroupConfigs, 'groupConfigs');

            return serviceContainerProductVersionPatch.run({
              serviceData: { id: productVersionId, patchData },
              onSuccess: () => navigate('../group-configs'),
              onError: () => console.error('Failed to edit Product Version Group Configs.'),
            });
          }}
          serviceContainer={serviceContainerProductVersionPatch}
        >
          <List>
            {!!removedGroupConfigs.length && (
              <ListItem>
                {removedGroupConfigs.length} Group Config{removedGroupConfigs.length > 1 && 's'} to be removed.
              </ListItem>
            )}
            {!!addedGroupConfigs.length && (
              <ListItem>
                {addedGroupConfigs.length} Group Config{addedGroupConfigs.length > 1 && 's'} to be added.
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
            cancelAllGroupConfigChanges();
            toggleCancelAllModal();
          }}
        >
          All changes made will be forgotten.
        </ActionConfirmModal>
      )}
    </PageLayout>
  );
};
