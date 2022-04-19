import { PageLayout } from '../PageLayout/PageLayout';
import { Card, CardTitle, CardBody, Flex, FlexItem } from '@patternfly/react-core';
import { Build } from 'pnc-api-types-ts';
import { BuildStatus } from '../BuildStatus/BuildStatus';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';
import { BuildMetrics } from '../BuildMetrics/BuildMetrics';
import { BuildName } from '../BuildName/BuildName';
import { ProductMilestoneReleaseLabel } from '../ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import mockBuildData from './data/mock-build-data.json';

const buildRes: Build[] = mockBuildData;

export const DemoPage = () => {
  return (
    <PageLayout title="Component Demo" description="Component demo page intended for showcasing React components.">
      <Flex direction={{ default: 'column' }}>
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
        {/* Need to be implemented until the unit test for build Metrics finished so that to mock the kafka service */}
        {/* <FlexItem>
          <Card>
            <CardTitle>BuildMetrics</CardTitle>
            <CardBody>
              <BuildMetrics builds={buildRes} chartType="line" componentId="BMTEST1"></BuildMetrics>
              <br />
              <BuildMetrics builds={buildRes} chartType="horizontalBar" componentId="BMTEST2"></BuildMetrics>
            </CardBody>
          </Card>
        </FlexItem> */}
      </Flex>
    </PageLayout>
  );
};
