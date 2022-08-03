import { PageLayout } from '../PageLayout/PageLayout';
import { useState } from 'react';
import {
  ActionGroup,
  Button,
  Card,
  CardTitle,
  CardBody,
  Flex,
  Form,
  FormGroup,
  FormHelperText,
  FlexItem,
  Select,
  SelectOption,
  SelectVariant,
  Tooltip,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { Build } from 'pnc-api-types-ts';
import { BuildStatus } from '../BuildStatus/BuildStatus';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';
import { BuildMetrics } from '../BuildMetrics/BuildMetrics';
import { BuildName } from '../BuildName/BuildName';
import { ProductMilestoneReleaseLabel } from '../ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { BuildStartButton } from '../BuildStartButton/BuildStartButton';
import { AttributesItems } from '../AttributesItems/AttributesItems';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { ActionButton } from '../ActionButton/ActionButton';
import mockBuildData from './data/mock-build-data.json';
import { useTitle } from '../../containers/useTitle';
import { useForm } from '../../containers/useForm';

const buildRes: Build[] = mockBuildData;

export const DemoPage = () => {
  useTitle('Demo Page');

  const submitForm = () => {
    console.log('form state when submitted:', {
      ...form,
    });
  };

  const { form, onChange, onSubmit, isSubmitDisabled } = useForm(
    {
      inputFieldA: {
        value: '',
        validation: { isRequired: true },
      },
      textAreaA: {
        value: '',
      },
      selectA: {
        value: '',
        validation: { isRequired: true },
      },
    },
    submitForm
  );

  const defaultSelectOptions = [{ value: 'Build' }, { value: 'Option' }, { value: 'Project' }, { value: 'Version' }];

  const [selectOptions, setSelectOptions] = useState<any>(defaultSelectOptions);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const clearSelection = () => {
    onChange('selectA', null);
    setIsSelectOpen(false);
    setSelectOptions(defaultSelectOptions);
  };

  const formComponent = (
    <Card>
      <CardBody>
        <div className="w-70">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormGroup
              isRequired
              label="Input Field"
              fieldId="inputFieldA"
              helperText={
                <FormHelperText isHidden={form.inputFieldA.state !== 'error'} isError>
                  {form.inputFieldA.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <TextInput
                isRequired
                validated={form.inputFieldA.state}
                type="text"
                id="inputFieldA"
                name="inputFieldA"
                value={form.inputFieldA.value}
                autoComplete="off"
                onChange={(text) => {
                  onChange('inputFieldA', text);
                }}
              />
            </FormGroup>
            <FormGroup label="Text Area" fieldId="textAreaA">
              <TextArea
                id="textAreaA"
                name="textAreaA"
                value={form.textAreaA.value}
                onChange={(text) => {
                  onChange('textAreaA', text);
                }}
                autoResize
              />
            </FormGroup>
            <FormGroup
              isRequired
              label="Filtered Select"
              fieldId="selectA"
              helperText={
                <FormHelperText isHidden={form.selectA.state !== 'error'} isError>
                  {form.selectA.errorMessages?.join(' ')}
                </FormHelperText>
              }
            >
              <Select
                validated={form.selectA.state}
                id="selectA"
                variant={SelectVariant.typeahead}
                typeAheadAriaLabel="Select an option"
                onToggle={(isOpen) => {
                  setIsSelectOpen(isOpen);
                }}
                onSelect={(event, selection, isPlaceholder) => {
                  if (isPlaceholder) clearSelection();
                  else {
                    onChange('selectA', selection);
                    setIsSelectOpen(false);
                  }
                }}
                onClear={clearSelection}
                selections={form.selectA.value}
                isOpen={isSelectOpen}
                aria-labelledby={'selectA'}
                placeholderText="Select an option"
              >
                {selectOptions.map((option: any, index: any) => (
                  <SelectOption key={index} value={option.value} />
                ))}
              </Select>
            </FormGroup>
            <ActionGroup>
              <Button
                variant="primary"
                isDisabled={isSubmitDisabled}
                onClick={() => {
                  onSubmit();
                }}
              >
                Submit
              </Button>
            </ActionGroup>
          </Form>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <PageLayout title="Component Demo" description="Component demo page intended for showcasing React components.">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Card>
            <CardTitle>Form Demo</CardTitle>
            <CardBody>{formComponent}</CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStatus</CardTitle>
            <CardBody>
              <BuildStatus
                long
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
              />
              <BuildStatus
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'SUCCESS',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                }}
              />
              <BuildStatus
                long
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'FAILED',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
              <BuildStatus
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'REJECTED_FAILED_DEPENDENCIES',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStatusIcon</CardTitle>
            <CardBody>
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                  alignmentPreference: 'PREFER_PERSISTENT',
                }}
              />
              <br />
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'SYSTEM_ERROR',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  alignmentPreference: 'PREFER_TEMPORARY',
                }}
              />
              <br />
              <BuildStatusIcon
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'REJECTED_FAILED_DEPENDENCIES',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildName</CardTitle>
            <CardBody>
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                long
                includeBuildLink
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                long
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
                includeBuildLink
                includeConfigLink
              />
              <br />
              <BuildName
                build={{
                  id: '0',
                  submitTime: '2017-12-01T13:17:18.007Z',
                  status: 'BUILDING',
                  buildConfigRevision: {
                    id: '2',
                    name: 'whatever',
                  },
                  user: {
                    id: '3',
                    username: 'robot',
                  },
                  temporaryBuild: true,
                  attributes: {
                    POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
                    PNC_SYSTEM_ERROR: 'DISABLED_FIREWALL',
                  },
                }}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>ProductMilestoneReleaseLabel</CardTitle>
            <CardBody>
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'ERP1.2.3',
                  startingDate: '2000-12-26T05:00:00Z',
                  plannedEndDate: '2030-12-26T05:00:00Z',
                  endDate: '2030-12-26T05:00:00Z',
                }}
                isCurrent={false}
              />
              <br />
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'ERP1.2.4-C',
                  startingDate: '2000-12-26T05:00:00Z',
                  plannedEndDate: '2030-12-26T05:00:00Z',
                  endDate: '2030-12-26T05:00:00Z',
                }}
                isCurrent={true}
              />
              <br />
              <ProductMilestoneReleaseLabel
                productMilestoneRelease={{
                  id: '5',
                  version: 'CAM1.2.5',
                  supportLevel: 'EARLYACCESS',
                  releaseDate: '2021-12-10T05:00:00Z',
                }}
                isCurrent={true}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildMetrics</CardTitle>
            <CardBody>
              <BuildMetrics builds={buildRes} chartType="line" componentId="BMTEST1"></BuildMetrics>
              <br />
              <BuildMetrics builds={buildRes} chartType="horizontalBar" componentId="BMTEST2"></BuildMetrics>
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>BuildStartButtonGroup</CardTitle>
            <CardBody>
              <BuildStartButton
                buildConfig={{
                  buildType: 'MVN',
                  id: 'demoId',
                  name: 'Demo Name',
                }}
              ></BuildStartButton>
              Build Config Verison
              <br />
              <br />
              <BuildStartButton
                groupConfig={{
                  id: 'demoId',
                  name: 'Demo Name',
                }}
              ></BuildStartButton>
              Group Config Version
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>AttributesItems</CardTitle>
            <CardBody>
              <AttributesItems
                attributes={[
                  {
                    name: 'Project URL',
                    value: (
                      <a href={'demo'} target="_blank" rel="noopener noreferrer">
                        Text Example
                      </a>
                    ),
                  },
                  {
                    name: (
                      <span>
                        Icon has Tooltip{' '}
                        <Tooltip content={<div>This icon has a tooltip!</div>}>
                          <InfoCircleIcon />
                        </Tooltip>
                      </span>
                    ),
                    value: undefined,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </FlexItem>

        <FlexItem>
          <Card>
            <CardTitle>ActionButton</CardTitle>
            <CardBody>
              <ActionButton iconType="create" link="/projects">
                Button with create icon
              </ActionButton>
              <span>On click, move to the specified web link (this one links to projects)</span>
              <br />
              <ActionButton iconType="edit" action={() => alert('Hello this is actionbutton!')}>
                Edit
              </ActionButton>
              <span>On click, performs a function (this one creates an alert)</span>
              <br />
              <ActionButton iconType="delete">Delete</ActionButton>
              <br />
              <ActionButton iconType="clone">Clone</ActionButton>
              <br />
              <ActionButton iconType="quality">Quality</ActionButton>
              <br />
              <ActionButton iconType="external">External, set text such as Push to Brew</ActionButton>
              <br />
              <ActionButton iconType="mark">Mark as current</ActionButton>
              <br />
              <ActionButton>No Icon</ActionButton>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
