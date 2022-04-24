import { Button, Checkbox, Divider, Dropdown, DropdownToggle, Popover, Radio } from '@patternfly/react-core';
import { InfoCircleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';
import { useEffect, useState } from 'react';
import styles from './BuildStartButtonGroup.module.css';

interface IBuildStartButtonGroupProp {
  /**
   * Object: The configuration representing Build Config
   */
  buildConfig?: BuildConfiguration;

  /**
   * Object: The configuration representing Group Config
   */
  groupConfig?: GroupConfiguration;

  /**
   * String: Value representing bootstrap button size: lg, md(default if empty), sm
   */
  size?: string;
}

interface IParamOption {
  title: string;
  value: string;
  description?: string;
}

interface IParams {
  id: string;
  temporaryBuild: boolean;
  alignmentPreference?: string;
  rebuildMode: string;
  keepPodOnFailure?: boolean;
  buildDependencies?: boolean;
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
  'Test build, which cannot be used for product release and which will be garbage collected during automatic cleaning';
const keepPodOnFailureAPopoverText =
  "The builder container won't be destroyed if the build fails and you can use SSH to debug it";
const buildDependenciesPopoverText = 'Build also dependencies of this build configuration if they are not built yet';
const descriptionTextPopoverText =
  'Not implicit (automatically captured) ones - those are used only to determine if the rebuild is required';
const alignmentPreferencePopoverText = (
  <div>
    <p>Select temporary build dependency alignment preferences:</p>
    <br />
    <p>
      <b>Persistent</b>
      <li>Prefers latest persistent build version</li>
    </p>
    <br />
    <p>
      <b>Temporary</b>
      <li>Prefers latest temporary build version</li>
    </p>
  </div>
);
const rebuildModePopoverText = (
  <div>
    <p>Rebuild a previously successful build config when:</p>
    <br />
    <p>
      <b>Explicit</b>
      <li>The build config has been modified since the last successful build</li>
      <li>A build config, explicitly defined as a dependency of this one, has been modified</li>
      <li>since the last successful build</li>
      <li>There exists a newer, successful build of a build config explicitly defined as a dependency of this one</li>
    </p>
    <br />
    <p>
      <b>Implicit</b>
      <li>
        <b>Explicit</b> criteria plus:
      </li>
      <li>
        There exists a newer version of an implicit dependency (automatically captured from sources such as Indy, MRRC or Maven
        Central)
      </li>
    </p>
    <br />
    <p>
      <b>Force</b>
      <li>Always</li>
    </p>
  </div>
);

export const BuildStartButtonGroup = ({ buildConfig, groupConfig, size = 'md' }: IBuildStartButtonGroupProp) => {
  const [isTempBuild, setIsTempBuild] = useState(false);
  const [alignmentPreference, setAlignmentPreference] = useState<IParamOption | undefined>(
    alignmentPreferences[ALIGNMENT_PREFERENCE_DEFAULT_INDEX]
  );
  const [rebuildMode, setRebuildMode] = useState(rebuildModes[REBUILD_MODE_DEFAULT_INDEX]);
  const [keepPodOnFailure, setKeepPodOnFailure] = useState<boolean>();
  const [buildDependencies, setBuildDependencies] = useState<boolean>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  let params: IParams = {
    id: '',
    temporaryBuild: false,
    alignmentPreference: '',
    rebuildMode: '',
    keepPodOnFailure: false,
    buildDependencies: false,
  };

  useEffect(() => {
    if (buildConfig) {
      setKeepPodOnFailure(false);
      setBuildDependencies(true);
    }
  }, [buildConfig]);

  const triggerBuild = () => {
    setIsDropdownOpen(false);

    if (!isTempBuild) {
      setAlignmentPreference(undefined);
    }
    params.temporaryBuild = isTempBuild;
    params.alignmentPreference = alignmentPreference ? alignmentPreference.value : undefined;
    params.rebuildMode = rebuildMode.value;
    params.keepPodOnFailure = keepPodOnFailure;
    params.buildDependencies = buildDependencies;
    if (buildConfig) {
      // @Todo: change to $log.debug()
      console.log('pncBuildStart: Initiating build of: %O', buildConfig);
      params.id = buildConfig.id;
      // @Todo: BuildConfigService.build(params);
    } else if (groupConfig) {
      // @Todo: change to $log.debug()
      console.log('pncBuildStart: Initiating build of: %O', groupConfig);
      params.id = groupConfig.id;
      // @Todo: GroupConfigService.build(params);
    }
  };

  return (
    <>
      <Button variant="primary" isSmall={size === 'sm'} isLarge={size === 'lg'} onClick={triggerBuild}>
        Build
      </Button>
      <Dropdown
        toggle={
          <DropdownToggle onToggle={() => setIsDropdownOpen(!isDropdownOpen)} id="dropdown-toggle">
            {isTempBuild ? 'Temporary' : 'Persistent'}
          </DropdownToggle>
        }
        isOpen={isDropdownOpen}
      >
        <div className={styles['dropdown-panel']}>
          <div className={styles['dropdown-icon-item']}>
            <Radio
              isChecked={!isTempBuild}
              name="isTempBuild-false-radio"
              onChange={() => setIsTempBuild(false)}
              label="Persistent"
              id="isTempBuild-false-radio"
            />
            <span className={'pnc-info-icon'}>
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
              onChange={() => setIsTempBuild(true)}
              label="Temporary"
              id="isTempBuild-true-radio"
            />
            <span className={'pnc-warning-icon'}>
              <Popover bodyContent={temporaryPopoverText} showClose={false} enableFlip={false} position="auto">
                <small>
                  <WarningTriangleIcon />
                </small>
              </Popover>
            </span>
          </div>
          <Divider />
          {isTempBuild && (
            <>
              <div>
                Alignment Preference
                <span className={'pnc-info-icon'}>
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
              <Divider />
            </>
          )}
          <div>
            Rebuild Mode
            <span className={'pnc-info-icon'}>
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
          <Divider />
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
                <span className={'pnc-info-icon'}>
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
                <span className={'pnc-info-icon'}>
                  <Popover bodyContent={buildDependenciesPopoverText} showClose={false} enableFlip={false} position="auto">
                    <small>
                      <InfoCircleIcon />
                    </small>
                  </Popover>
                </span>
              </div>
              <Divider />
            </>
          )}
          <small className={styles['description-text']}>
            <p>
              Press Build button to start {isTempBuild ? 'Temporary' : 'Persistent'} {rebuildMode.title} build
            </p>
            {buildDependencies && (
              <span>
                <p>
                  Applying the same Rebuild Mode also to explicitly defined dependencies
                  <span className={'pnc-info-icon'}>
                    <Popover bodyContent={descriptionTextPopoverText} showClose={false} enableFlip={false} position="auto">
                      <InfoCircleIcon />
                    </Popover>
                  </span>
                </p>
              </span>
            )}
          </small>
        </div>
      </Dropdown>
    </>
  );
};
