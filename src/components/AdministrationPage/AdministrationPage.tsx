import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Switch,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { CSSProperties, useCallback, useState } from 'react';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { useInterval } from '../../containers/useInterval';
import { useTitle } from '../../containers/useTitle';

import { buildService } from '../../services/buildService';

import { AttributesItems } from '../AttributesItems/AttributesItems';
import { PageLayout } from './../PageLayout/PageLayout';

const REFRESH_INTERVAL_SECONDS = 90;

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  const maintenanceSwitchStyle: CSSProperties = {
    paddingTop: '5px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: '5px',
  };
  const [secondsUntilReload, setSecondsUntilReload] = useState<number>(0);
  const dataContainer = useDataContainer(
    useCallback(({ requestConfig }: IService) => buildService.getBuildCount(requestConfig), [])
  );
  const dataContainerRefresh = dataContainer.refresh;

  const refreshBuildCounts = useCallback(() => {
    dataContainerRefresh({});
    setSecondsUntilReload(REFRESH_INTERVAL_SECONDS);
  }, [dataContainerRefresh]);

  const restartInterval = useInterval(
    useCallback(() => {
      setSecondsUntilReload(secondsUntilReload - 1);
      if (secondsUntilReload <= 1) {
        refreshBuildCounts();
      }
    }, [secondsUntilReload, refreshBuildCounts]),
    1000,
    true
  );

  useTitle('Administration');

  return (
    <PageLayout title="Administration" description="Administration tools for admin users">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Form isHorizontal>
            <Card>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <FormGroup label="PNC System Version" fieldId="form-pnc-system-version">
                      <TextInput type="text" id="form-pnc-system-version" name="form-pnc-system-version" />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="primary" id="form-pnc-system-version-update" name="form-pnc-system-version-update">
                      Update
                    </Button>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </Form>
        </FlexItem>
        <FlexItem>
          <Card>
            <CardBody>
              <Grid hasGutter>
                <GridItem span={12}>
                  <DataContainer {...dataContainer} title="Builds Count">
                    <AttributesItems
                      attributes={[
                        {
                          name: 'Running builds count',
                          value: dataContainer.data?.running,
                        },
                        {
                          name: 'Enqueued builds count',
                          value: dataContainer.data?.enqueued,
                        },
                        {
                          name: 'Waiting for dependencies builds count',
                          value: dataContainer.data?.waitingForDependencies,
                        },
                      ]}
                    />
                  </DataContainer>
                </GridItem>
                <GridItem span={4}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      refreshBuildCounts();
                      restartInterval();
                    }}
                  >
                    Refresh ({secondsUntilReload} s)
                  </Button>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </FlexItem>
        <FlexItem>
          <Form isHorizontal>
            <Card>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <FormGroup label="Maintenance Mode" fieldId="form-maintenance-mode">
                      <div style={maintenanceSwitchStyle}>
                        <Switch
                          id="form-maintenance-mode-switch"
                          name="form-maintenance-mode-switch"
                          label="Maintenance Mode On"
                          labelOff="Maintenance Mode Off"
                          isChecked={isMaintenanceModeOn}
                          onChange={() => {
                            setIsMaintenanceModeOn(!isMaintenanceModeOn);
                          }}
                        />
                      </div>
                    </FormGroup>
                  </GridItem>
                  <GridItem span={12}>
                    <FormGroup label="Announcement" fieldId="form-announcement">
                      <TextArea name="form-announcement" id="form-announcement" />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="primary" id="form-announcement-update" name="form-announcement-update">
                      Update
                    </Button>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </Form>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
