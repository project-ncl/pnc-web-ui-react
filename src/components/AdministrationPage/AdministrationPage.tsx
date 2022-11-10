import {
  Button,
  Card,
  CardBody,
  DatePicker,
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
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { CSSProperties, useCallback, useEffect, useState } from 'react';

import { DataContainer } from 'containers/DataContainer/DataContainer';
import { ServiceContainerCreatingUpdating } from 'containers/DataContainer/ServiceContainerCreatingUpdating';
import { IService, useDataContainer } from 'containers/DataContainer/useDataContainer';
import { useInterval } from 'containers/useInterval';
import { useTitle } from 'containers/useTitle';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { TopBarInfo } from 'components/TopBar/TopBarInfo';

import * as buildService from 'services/buildService';
import * as genericSettingsService from 'services/genericSettingsService';

import { transDateFormat } from 'utils/utils';

const REFRESH_INTERVAL_SECONDS = 90;

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  const maintenanceSwitchStyle: CSSProperties = {
    paddingTop: '5px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: '5px',
  };

  const [announcementMessage, setAnnouncementMessage] = useState<string>('');
  const [etaTime, setEtaTime] = useState<string>();
  const [isEtaNa, setIsEtaNa] = useState<boolean>(false);
  const [announcementTouched, setAnnouncementTouched] = useState<boolean>(false);
  const [etaTouched, setEtaTouched] = useState<boolean>(false);
  const dataContainerAnnouncement = useDataContainer(
    ({ serviceData }: IService<string>) => genericSettingsService.setAnnouncementBanner(serviceData as string),
    {
      initLoadingState: false,
    }
  );

  const validateForm = () => {
    setAnnouncementTouched(true);
    setEtaTouched(true);
    return !invalidAnnouncement() && !invalidEtaTime();
  };

  const invalidAnnouncement = () => {
    return isMaintenanceModeOn && announcementTouched && (!announcementMessage || announcementMessage === '');
  };

  const invalidEtaTime = () => {
    return isMaintenanceModeOn && etaTouched && !isEtaNa && (!etaTime || etaTime === '');
  };

  useEffect(() => {
    genericSettingsService
      .getAnnouncementBanner()
      .then((response: any) => {
        const rawAnnouncement: string = response.data.banner;
        const rawAnnouncementSet: Array<string> = rawAnnouncement ? rawAnnouncement.split(', ETA: ') : [];
        setAnnouncementMessage(rawAnnouncementSet[0]);
        if (rawAnnouncementSet[1]) {
          if (rawAnnouncementSet[1] !== 'N/A') {
            setEtaTime(rawAnnouncementSet[1]);
            setIsEtaNa(false);
          } else {
            setEtaTime(undefined);
            setIsEtaNa(true);
          }
        }
        setIsMaintenanceModeOn(rawAnnouncementSet[1] ? true : false);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

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
                  <ServiceContainerCreatingUpdating {...dataContainerAnnouncement} title="Announcement">
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
                              setAnnouncementTouched(false);
                              isMaintenanceModeOn && setEtaTime(undefined);
                              setIsMaintenanceModeOn(!isMaintenanceModeOn);
                            }}
                          />
                        </div>
                      </FormGroup>
                    </GridItem>
                    <GridItem span={12}>
                      <FormGroup
                        label={(isMaintenanceModeOn ? '* ' : '') + 'Announcement'}
                        fieldId="form-announcement"
                        helperTextInvalid={invalidAnnouncement() ? 'Required field.' : null}
                        helperTextInvalidIcon={<ExclamationCircleIcon />}
                        validated={'error'}
                      >
                        <TextArea
                          name="form-announcement"
                          id="form-announcement"
                          value={announcementMessage}
                          onChange={(value: string) => {
                            setAnnouncementMessage(value);
                          }}
                          onBlur={() => {
                            setAnnouncementTouched(true);
                          }}
                        />
                      </FormGroup>
                    </GridItem>
                    {isMaintenanceModeOn && (
                      <GridItem span={12}>
                        <FormGroup
                          label="* ETA Time"
                          fieldId="eta-time"
                          helperTextInvalid={invalidEtaTime() ? 'Required field.' : null}
                          helperTextInvalidIcon={<ExclamationCircleIcon />}
                          validated={'error'}
                        >
                          <DatePicker
                            required
                            isDisabled={!isMaintenanceModeOn || isEtaNa}
                            name="form-etaTime"
                            id="eta-time"
                            placeholder="yyyy-MM-dd hh:mm (UTC)"
                            dateFormat={transDateFormat}
                            onClick={() => {
                              setEtaTouched(true);
                            }}
                            dateParse={(dateString) => {
                              return new Date(dateString);
                            }}
                            value={etaTime}
                            onBlur={(value: string) => {
                              setEtaTime(value);
                            }}
                            onChange={(value: string) => {
                              setEtaTime(value);
                            }}
                            aria-invalid={invalidEtaTime()}
                          />
                          &nbsp;&nbsp;
                          <Switch
                            id="eta-na-switch"
                            label=" N/A:"
                            labelOff=" N/A:"
                            hasCheckIcon
                            isChecked={isEtaNa}
                            onChange={() => {
                              setIsEtaNa(!isEtaNa);
                              setEtaTouched(true);
                            }}
                            isReversed
                          />
                        </FormGroup>
                      </GridItem>
                    )}
                    {isMaintenanceModeOn && (
                      <GridItem span={12}>
                        <FormGroup label="Example" fieldId="eta-time">
                          {isMaintenanceModeOn && (
                            <TopBarInfo>
                              Maintenance Mode - PNC system is in the maintenance mode, no new build requests are accepted.
                              Reason: {announcementMessage ? announcementMessage : 'N/A'}, ETA: {etaTime ? etaTime : 'N/A'}
                            </TopBarInfo>
                          )}
                          {!isMaintenanceModeOn && <TopBarInfo>Announcement - {announcementMessage}</TopBarInfo>}
                        </FormGroup>
                      </GridItem>
                    )}
                  </ServiceContainerCreatingUpdating>
                  <GridItem span={4}>
                    <Button
                      variant="primary"
                      id="form-announcement-update"
                      name="form-announcement-update"
                      onClick={() => {
                        validateForm() &&
                          dataContainerAnnouncement.refresh({
                            serviceData:
                              announcementMessage + (isMaintenanceModeOn ? ', ETA: ' + (etaTime ? etaTime : 'N/A') : ''),
                          });
                      }}
                    >
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
