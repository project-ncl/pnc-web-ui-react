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

import { useInterval } from 'hooks/useInterval';
import { IService, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { AttributesItems } from 'components/AttributesItems/AttributesItems';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TopBarInfo } from 'components/TopBar/TopBarInfo';

import * as buildApi from 'services/buildApi';
import * as genericSettingsApi from 'services/genericSettingsApi';

import { transformateDateFormat } from 'utils/utils';

const REFRESH_INTERVAL_SECONDS = 90;
const N_A = 'N/A';

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
  const serviceContainerAnnouncement = useServiceContainer(
    ({ serviceData }: IService<string>) => genericSettingsApi.setAnnouncementBanner(serviceData as string),
    {
      initLoadingState: false,
    }
  );

  const validateForm = () => {
    setAnnouncementTouched(true);
    setEtaTouched(true);
    return !isAnnouncementInvalid() && !isEtaTimeInvalid();
  };

  const isAnnouncementInvalid = () => {
    return isMaintenanceModeOn && announcementTouched && (!announcementMessage || announcementMessage === '');
  };

  const isEtaTimeInvalid = () => {
    return isMaintenanceModeOn && etaTouched && !isEtaNa && (!etaTime || etaTime === '');
  };

  useEffect(() => {
    genericSettingsApi
      .getAnnouncementBanner()
      .then((response: any) => {
        const rawAnnouncement: string = response.data.banner;
        const rawAnnouncementSet: Array<string> = rawAnnouncement ? rawAnnouncement.split(', ETA: ') : [];
        setAnnouncementMessage(rawAnnouncementSet[0]);
        if (rawAnnouncementSet[1]) {
          if (rawAnnouncementSet[1] !== N_A) {
            setEtaTime(rawAnnouncementSet[1]);
            setIsEtaNa(false);
          } else {
            setEtaTime(undefined);
            setIsEtaNa(true);
          }
        }
        setIsMaintenanceModeOn(!!rawAnnouncementSet[1]);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  const [secondsUntilReload, setSecondsUntilReload] = useState<number>(0);
  const serviceContainerBuildCount = useServiceContainer(
    useCallback(({ requestConfig }: IService) => buildApi.getBuildCount(requestConfig), [])
  );
  const serviceContainerBuildCountRefresh = serviceContainerBuildCount.refresh;

  const refreshBuildCounts = useCallback(() => {
    serviceContainerBuildCountRefresh({});
    setSecondsUntilReload(REFRESH_INTERVAL_SECONDS);
  }, [serviceContainerBuildCountRefresh]);

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
                  <ServiceContainerLoading {...serviceContainerBuildCount} title="Builds Count">
                    <AttributesItems
                      attributes={[
                        {
                          name: 'Running builds count',
                          value: serviceContainerBuildCount.data?.running,
                        },
                        {
                          name: 'Enqueued builds count',
                          value: serviceContainerBuildCount.data?.enqueued,
                        },
                        {
                          name: 'Waiting for dependencies builds count',
                          value: serviceContainerBuildCount.data?.waitingForDependencies,
                        },
                      ]}
                    />
                  </ServiceContainerLoading>
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
                  <ServiceContainerCreatingUpdating {...serviceContainerAnnouncement} title="Announcement">
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
                        label="Announcement"
                        isRequired={isMaintenanceModeOn}
                        fieldId="form-announcement"
                        helperTextInvalid={isAnnouncementInvalid() ? 'Required field.' : null}
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
                          label="ETA Time"
                          isRequired={true}
                          fieldId="form-eta-time"
                          helperTextInvalid={isEtaTimeInvalid() ? 'Required field.' : null}
                          helperTextInvalidIcon={<ExclamationCircleIcon />}
                          validated={'error'}
                        >
                          <DatePicker
                            required
                            isDisabled={isEtaNa}
                            name="form-eta-time"
                            id="form-eta-time"
                            placeholder="yyyy-MM-dd hh:mm (UTC)"
                            dateFormat={transformateDateFormat}
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
                            aria-invalid={isEtaTimeInvalid()}
                          />
                          &nbsp;&nbsp;
                          <Switch
                            id="form-eta-na-switch"
                            label=" N/A:"
                            labelOff=" N/A:"
                            hasCheckIcon
                            isChecked={isEtaNa}
                            onChange={() => {
                              setIsEtaNa(!isEtaNa);
                              setEtaTime(undefined);
                              setEtaTouched(true);
                            }}
                            isReversed
                          />
                        </FormGroup>
                      </GridItem>
                    )}
                    <GridItem span={12}>
                      {isMaintenanceModeOn && (
                        <TopBarInfo hideCloseButton={true}>
                          Maintenance Mode - PNC system is in the maintenance mode, no new build requests are accepted. Reason:{' '}
                          {announcementMessage ? announcementMessage : N_A}, ETA: {etaTime ? etaTime : N_A}
                        </TopBarInfo>
                      )}
                      {!isMaintenanceModeOn && announcementMessage && (
                        <TopBarInfo hideCloseButton={true}>Announcement - {announcementMessage}</TopBarInfo>
                      )}
                    </GridItem>
                  </ServiceContainerCreatingUpdating>
                  <GridItem span={4}>
                    <Button
                      variant="primary"
                      id="form-announcement-update"
                      name="form-announcement-update"
                      onClick={() => {
                        validateForm() &&
                          serviceContainerAnnouncement.refresh({
                            serviceData: announcementMessage + (isMaintenanceModeOn ? ', ETA: ' + (etaTime ? etaTime : N_A) : ''),
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
