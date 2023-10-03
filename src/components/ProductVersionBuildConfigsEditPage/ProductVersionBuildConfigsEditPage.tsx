import { Button, Grid, GridItem, List, ListItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionConfirmModal } from 'components/ActionConfirmModal/ActionConfirmModal';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { BuildConfigsAddList } from 'components/ProductVersionBuildConfigsEditPage/BuildConfigsAddList';
import { BuildConfigsChangesList } from 'components/ProductVersionBuildConfigsEditPage/BuildConfigsChangesList';
import { BuildConfigsRemoveList } from 'components/ProductVersionBuildConfigsEditPage/BuildConfigsRemoveList';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as buildConfigApi from 'services/buildConfigApi';
import * as productVersionApi from 'services/productVersionApi';

import { createArrayPatchSimple } from 'utils/patchHelper';
import { generatePageTitle } from 'utils/titleHelper';

export interface IBuildConfigChange {
  data: BuildConfiguration;
  operation: 'add' | 'remove';
}

interface IProductVersionBuildConfigsEditPageProps {
  componentIdProductVersionBuildConfigs?: string;
  componentIdProjectBuildConfigs?: string;
}

export const ProductVersionBuildConfigsEditPage = ({
  componentIdProductVersionBuildConfigs = 'v1',
  componentIdProjectBuildConfigs = 'p1',
}: IProductVersionBuildConfigsEditPageProps) => {
  const { productVersionId } = useParams();

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

  const [buildConfigChanges, setBuildConfigChanges] = useState<IBuildConfigChange[]>([]);
  const [wereBuildConfigsChanged, setWereBuildConfigsChanged] = useState<boolean>(false);
  const removedBuildConfigs = buildConfigChanges
    .filter((buildConfigChange) => buildConfigChange.operation === 'remove')
    .map((buildConfigChange) => buildConfigChange.data);
  const addedBuildConfigs = buildConfigChanges
    .filter((buildConfigChange) => buildConfigChange.operation === 'add')
    .map((buildConfigChange) => buildConfigChange.data);

  const addBuildConfigChange = (buildConfig: BuildConfiguration, operation: IBuildConfigChange['operation']) =>
    setBuildConfigChanges((buildConfigChanges) => {
      const otherBuildConfigChanges = buildConfigChanges.filter(
        (buildConfigChange) => buildConfigChange.data.id !== buildConfig.id
      );
      return [...otherBuildConfigChanges, { data: buildConfig, operation: operation }];
    });

  const cancelBuildConfigChange = (buildConfig: BuildConfiguration) =>
    setBuildConfigChanges((buildConfigChanges) => {
      return buildConfigChanges.filter((buildConfigChange) => buildConfigChange.data.id !== buildConfig.id);
    });

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
    ({ requestConfig } = {}) =>
      serviceContainerProductVersionBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
    { componentId: componentIdProductVersionBuildConfigs }
  );

  useQueryParamsEffect(serviceContainerProjectBuildConfigsRunner, { componentId: componentIdProjectBuildConfigs });

  useTitle(
    generatePageTitle({
      pageType: 'Edit',
      serviceContainer: serviceContainerProductVersion,
      firstLevelEntity: 'Product',
      nestedEntity: 'Version',
      entityName: `Build Configs of ${serviceContainerProductVersion.data?.version} ${PageTitles.delimiterSymbol} ${serviceContainerProductVersion.data?.product.name}`,
    })
  );

  return (
    <PageLayout
      title={`Add and remove Build Configs${productVersion ? ' in ' + productVersion : ''}`}
      actions={[
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
        </>,
      ]}
      description={
        <>
          <div>
            Update the list of Build Configs associated with the Version by removing existing ones or adding new ones. All the
            Build Configs marked to be removed or added are listed in the Changes Summary section. To submit the changes, use the
            Submit button.
          </div>
        </>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Build Configs currently in the Version</Text>
              </TextContent>
            </ToolbarItem>
          </Toolbar>

          <BuildConfigsRemoveList
            serviceContainerBuildConfigs={serviceContainerProductVersionBuildConfigs}
            componentId={componentIdProductVersionBuildConfigs}
            onBuildConfigRemove={(buildConfig: BuildConfiguration) => {
              addBuildConfigChange(buildConfig, 'remove');
            }}
            removedBuildConfigs={removedBuildConfigs}
          />
        </GridItem>

        <GridItem lg={12} xl2={6}>
          <Toolbar borderBottom>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>Add new Build Configs</Text>
              </TextContent>
            </ToolbarItem>
          </Toolbar>

          <BuildConfigsAddList
            serviceContainerBuildConfigs={serviceContainerProjectBuildConfigs}
            componentId={componentIdProjectBuildConfigs}
            onBuildConfigAdd={(buildConfig: BuildConfiguration) => {
              addBuildConfigChange(buildConfig, 'add');
            }}
            addedBuildConfigs={addedBuildConfigs}
            productVersionToExclude={productVersionId!}
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

          <BuildConfigsChangesList
            buildConfigChanges={buildConfigChanges}
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

            serviceContainerProductVersionPatch
              .run({ serviceData: { id: productVersionId, patchData } })
              .then(() => {
                navigate('../build-configs');
              })
              .catch(() => {
                console.error('Failed to edit Product Version Build Configs.');
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
            setBuildConfigChanges([]);
            toggleCancelAllModal();
          }}
        >
          All changes made will be forgotten.
        </ActionConfirmModal>
      )}
    </PageLayout>
  );
};
