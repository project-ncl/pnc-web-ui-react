import {
  Checkbox,
  Divider,
  Dropdown,
  List,
  ListItem,
  Menu,
  MenuContent,
  MenuToggle,
  Popover,
  Radio,
} from '@patternfly/react-core';
import { BuildIcon, InfoCircleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useState } from 'react';

import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { ProgressButton } from 'components/ProgressButton/ProgressButton';

import * as buildConfigApi from 'services/buildConfigApi';
import * as groupConfigApi from 'services/groupConfigApi';

import styles from './BuildStartButton.module.css';

interface IParamOption {
  title: string;
  value: string;
  description?: string;
}

const ALIGNMENT_PREFERENCE_DEFAULT_INDEX = 1;
const alignmentPreferences: Array<IParamOption> = [
  {
    title: 'Persistent',
    value: 'PREFER_PERSISTENT',
    description: 'Prefers latest persistent build version',
  },
  {
    title: 'Temporary',
    value: 'PREFER_TEMPORARY',
    description: 'Prefers latest temporary build version',
  },
];

const REBUILD_MODE_DEFAULT_INDEX = 1;
const rebuildModes: Array<IParamOption> = [
  {
    title: 'Explicit',
    value: 'EXPLICIT_DEPENDENCY_CHECK',
  },
  {
    title: 'Implicit',
    value: 'IMPLICIT_DEPENDENCY_CHECK',
  },
  {
    title: 'Force',
    value: 'FORCE',
  },
];

const persistentPopoverText = 'Standard build, which can be used for product release';
const temporaryPopoverText =
  'Temporary build, option used for test builds which will be garbage collected during automatic cleaning and cannot be used for product release';
const keepPodOnFailureAPopoverText =
  "The builder container won't be destroyed if the build fails and you can use SSH to debug it";
const buildDependenciesPopoverText = 'Build also dependencies of this build configuration if they are not built yet';
const descriptionTextPopoverText =
  'Not implicit (automatically captured) ones - those are used only to determine if the rebuild is required';
const alignmentPreferencePopoverText = (
  <>
    <p>Select temporary build dependency alignment preferences:</p>
    <br />
    <div>
      <b>Persistent</b>
      <List>
        <ListItem>Prefers latest persistent build version</ListItem>
      </List>
    </div>
    <br />
    <div>
      <b>Temporary</b>
      <List>
        <ListItem>Prefers latest temporary build version</ListItem>
      </List>
    </div>
  </>
);
const rebuildModePopoverText = (
  <>
    <p>Rebuild a previously successful build config when:</p>
    <br />
    <div>
      <b>Explicit</b>
      <List>
        <ListItem>The build config has been modified since the last successful build</ListItem>
        <ListItem>
          A build config, explicitly defined as a dependency of this one, has been modified since the last successful build
        </ListItem>
        <ListItem>
          There exists a newer, successful build of a build config explicitly defined as a dependency of this one
        </ListItem>
      </List>
    </div>
    <br />
    <div>
      <b>Implicit</b>
      <List>
        <ListItem>
          <b>Explicit</b> criteria plus:
        </ListItem>
        <ListItem>
          There exists a newer version of an implicit dependency (automatically captured from sources such as Indy, MRRC or Maven
          Central)
        </ListItem>
      </List>
    </div>
    <br />
    <div>
      <b>Force</b>
      <List>
        <ListItem>Always</ListItem>
      </List>
    </div>
  </>
);

interface IBuildStartButtonProp {
  buildConfig?: BuildConfiguration;
  groupConfig?: GroupConfiguration;
  isCompact?: boolean;
}

/**
 * Button starting the (Group) Build process.
 *
 * @param buildConfig - Build Config data
 * @param groupConfig - Group Config data
 * @param isCompact - Compact variant is smaller in size
 */
export const BuildStartButton = ({ buildConfig, groupConfig, isCompact = false }: IBuildStartButtonProp) => {
  const [isTempBuild, setIsTempBuild] = useState<boolean>(false);
  const [alignmentPreference, setAlignmentPreference] = useState<IParamOption | undefined>(undefined);
  const [rebuildMode, setRebuildMode] = useState<IParamOption>(rebuildModes[REBUILD_MODE_DEFAULT_INDEX]);
  const [keepPodOnFailure, setKeepPodOnFailure] = useState<boolean>(false);
  const [buildDependencies, setBuildDependencies] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const serviceContainerBuildStart = useServiceContainer(buildConfigApi.build);
  const serviceContainerGroupBuildStart = useServiceContainer(groupConfigApi.build);

  const serviceContainer = buildConfig ? serviceContainerBuildStart : serviceContainerGroupBuildStart;

  const params: buildConfigApi.IBuildStartParams | groupConfigApi.IGroupBuildStartParams = {
    id: '',
    temporaryBuild: false,
    alignmentPreference: undefined,
    rebuildMode: '',
  };

  const triggerBuild = () => {
    setIsDropdownOpen(false);

    if (!isTempBuild) {
      setAlignmentPreference(undefined);
    }
    params.temporaryBuild = isTempBuild;
    params.alignmentPreference = alignmentPreference ? alignmentPreference.value : undefined;
    params.rebuildMode = rebuildMode.value;
    if (buildConfig) {
      const buildStartParams = params as buildConfigApi.IBuildStartParams;
      buildStartParams.keepPodOnFailure = keepPodOnFailure;
      buildStartParams.buildDependencies = buildDependencies;
      buildStartParams.id = buildConfig.id;
      serviceContainerBuildStart.run({ serviceData: { buildStartParams } });
    } else if (groupConfig) {
      const groupBuildStartParams = params as groupConfigApi.IGroupBuildStartParams;
      params.id = groupConfig.id;
      serviceContainerGroupBuildStart.run({ serviceData: { groupBuildStartParams } });
    }
  };

  return (
    <div className={css(styles['button-wrapper'], isCompact && styles['is-compact'])}>
      <ProgressButton
        onClick={triggerBuild}
        serviceContainer={serviceContainer}
        icon={<BuildIcon />}
        isSmall
        className={styles['button-build']}
      >
        Build
      </ProgressButton>

      <Dropdown
        popperProps={dropdownPopperProps}
        toggle={(toggleRef) => (
          <MenuToggle
            id="dropdown-toggle"
            className={styles['toggle-button']}
            ref={toggleRef}
            onClick={() => setIsDropdownOpen((isDropdownOpen) => !isDropdownOpen)}
            isExpanded={isDropdownOpen}
          >
            {!isCompact && (isTempBuild ? 'Temporary' : 'Persistent')}
          </MenuToggle>
        )}
        onOpenChange={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
        isOpen={isDropdownOpen}
      >
        <Menu className={styles['dropdown-panel']}>
          <MenuContent>
            <div className={styles['dropdown-icon-item']}>
              <Radio
                isChecked={!isTempBuild}
                name="isTempBuild-false-radio"
                onChange={() => {
                  setIsTempBuild(false);
                  setAlignmentPreference(undefined);
                }}
                label="Persistent"
                id="isTempBuild-false-radio"
              />
              <span className="pnc-info-icon">
                <Popover bodyContent={persistentPopoverText} showClose={false} enableFlip={false} position="auto">
                  <small>
                    <InfoCircleIcon />
                  </small>
                </Popover>
              </span>
            </div>
            <div className={styles['dropdown-icon-item']}>
              <Radio
                isChecked={isTempBuild}
                name="isTempBuild-true-radio"
                onChange={() => {
                  setIsTempBuild(true);
                  setAlignmentPreference(alignmentPreferences[ALIGNMENT_PREFERENCE_DEFAULT_INDEX]);
                }}
                label="Temporary"
                id="isTempBuild-true-radio"
              />
              <span className="pnc-warning-icon">
                <Popover bodyContent={temporaryPopoverText} showClose={false} enableFlip={false} position="auto">
                  <small>
                    <WarningTriangleIcon />
                  </small>
                </Popover>
              </span>
            </div>

            <Divider className={styles['divider']} />

            {isTempBuild && (
              <>
                <div>
                  Alignment Preference
                  <span className="pnc-info-icon">
                    <Popover bodyContent={alignmentPreferencePopoverText} showClose={false} enableFlip={false} position="auto">
                      <small>
                        <InfoCircleIcon />
                      </small>
                    </Popover>
                  </span>
                </div>
                <div>
                  <Radio
                    isChecked={alignmentPreference === alignmentPreferences[0]}
                    name={`alignmentPref-${alignmentPreferences[0].title}-radio`}
                    onChange={() => setAlignmentPreference(alignmentPreferences[0])}
                    label={alignmentPreferences[0].title}
                    id={`alignmentPref-${alignmentPreferences[0].title}-radio`}
                  />
                </div>
                <div>
                  <Radio
                    isChecked={alignmentPreference === alignmentPreferences[1]}
                    name={`alignmentPref-${alignmentPreferences[1].title}-radio`}
                    onChange={() => setAlignmentPreference(alignmentPreferences[1])}
                    label={alignmentPreferences[1].title}
                    id={`alignmentPref-${alignmentPreferences[1].title}-radio`}
                  />
                </div>

                <Divider className={styles['divider']} />
              </>
            )}

            <div>
              Rebuild Mode
              <span className="pnc-info-icon">
                <Popover bodyContent={rebuildModePopoverText} showClose={false} enableFlip={false} position="auto">
                  <small>
                    <InfoCircleIcon />
                  </small>
                </Popover>
              </span>
            </div>
            <div>
              <Radio
                isChecked={rebuildMode === rebuildModes[0]}
                name={`rebuildMode-${rebuildModes[0].title}-radio`}
                onChange={() => setRebuildMode(rebuildModes[0])}
                label={rebuildModes[0].title}
                id={`rebuildMode-${rebuildModes[0].title}-radio`}
              />
            </div>
            <div>
              <Radio
                isChecked={rebuildMode === rebuildModes[1]}
                name={`rebuildMode-${rebuildModes[1].title}-radio`}
                onChange={() => setRebuildMode(rebuildModes[1])}
                label={rebuildModes[1].title}
                id={`rebuildMode-${rebuildModes[1].title}-radio`}
              />
            </div>
            <div>
              <Radio
                isChecked={rebuildMode === rebuildModes[2]}
                name={`rebuildMode-${rebuildModes[2].title}-radio`}
                onChange={() => setRebuildMode(rebuildModes[2])}
                label={rebuildModes[2].title}
                id={`rebuildMode-${rebuildModes[2].title}-radio`}
              />
            </div>

            <Divider className={styles['divider']} />

            {buildConfig && (
              <>
                <div className={styles['dropdown-icon-item']}>
                  <Checkbox
                    label="keep pod alive"
                    isChecked={keepPodOnFailure}
                    onChange={() => setKeepPodOnFailure(!keepPodOnFailure)}
                    id="keepPodOnFailure-check"
                    name="keepPodOnFailure-check"
                  />
                  <span className="pnc-info-icon">
                    <Popover bodyContent={keepPodOnFailureAPopoverText} showClose={false} enableFlip={false} position="auto">
                      <small>
                        <InfoCircleIcon />
                      </small>
                    </Popover>
                  </span>
                </div>
                <div className={styles['dropdown-icon-item']}>
                  <Checkbox
                    label="with dependencies"
                    isChecked={buildDependencies}
                    onChange={() => setBuildDependencies(!buildDependencies)}
                    id="buildDependencies-check"
                    name="buildDependencies-check"
                  />
                  <span className="pnc-info-icon">
                    <Popover bodyContent={buildDependenciesPopoverText} showClose={false} enableFlip={false} position="auto">
                      <small>
                        <InfoCircleIcon />
                      </small>
                    </Popover>
                  </span>
                </div>

                <Divider className={styles['divider']} />
              </>
            )}

            <small className={styles['description-text']}>
              <p>
                Press <i>Build</i> button to start
              </p>
              {buildDependencies && buildConfig && (
                <div>
                  {isTempBuild ? 'Temporary' : 'Persistent'} {rebuildMode.title} build applying the same Rebuild Mode also to
                  explicitly defined dependencies
                  <span className="pnc-info-icon">
                    <Popover bodyContent={descriptionTextPopoverText} showClose={false} enableFlip={false} position="auto">
                      <InfoCircleIcon />
                    </Popover>
                  </span>
                </div>
              )}
              {(!buildDependencies || groupConfig) && (
                <span>
                  <p>
                    {isTempBuild ? 'Temporary' : 'Persistent'} {rebuildMode.title} build
                  </p>
                </span>
              )}
            </small>
          </MenuContent>
        </Menu>
      </Dropdown>
    </div>
  );
};

const dropdownPopperProps = { position: 'right' } as const;
