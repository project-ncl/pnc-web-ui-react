import {
  ActionGroup,
  Button,
  DatePicker,
  Flex,
  FlexItem,
  FlexProps,
  Form,
  FormGroup,
  Switch,
  Text,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { CSSProperties, FormEvent, useCallback, useEffect, useState } from 'react';

import { useInterval } from 'hooks/useInterval';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TopBarInfo } from 'components/TopBar/TopBarInfo';

import * as buildApi from 'services/buildApi';
import * as genericSettingsApi from 'services/genericSettingsApi';
import { uiLogger } from 'services/uiLogger';

import { createDateTime } from 'utils/utils';

const REFRESH_INTERVAL_SECONDS = 90;
const N_A = 'N/A';

const spaceItemsXs: FlexProps['spaceItems'] = { default: 'spaceItemsXs' };
const directionColumn: FlexProps['direction'] = { default: 'column' };

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  const maintenanceSwitchStyle: CSSProperties = {
    paddingTop: '5px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: '5px',
  };

  const [pncVersion, setPncVersion] = useState<string>('');
  const serviceContainerPncVersionGet = useServiceContainer(genericSettingsApi.getPncVersion);
  const serviceContainerPncVersionGetRunner = serviceContainerPncVersionGet.run;
  const serviceContainerPncVersionSet = useServiceContainer(genericSettingsApi.setPncVersion);

  const [announcementMessage, setAnnouncementMessage] = useState<string>('');
  const [etaTime, setEtaTime] = useState<string>();
  const [isEtaNa, setIsEtaNa] = useState<boolean>(false);
  const [announcementTouched, setAnnouncementTouched] = useState<boolean>(false);
  const [etaTouched, setEtaTouched] = useState<boolean>(false);
  const serviceContainerAnnouncement = useServiceContainer(genericSettingsApi.setAnnouncementBanner);

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

    serviceContainerPncVersionGetRunner().then((response: any) => {
      setPncVersion(response.data);
    });
  }, [serviceContainerPncVersionGetRunner]);

  const [secondsUntilReload, setSecondsUntilReload] = useState<number>(0);

  const serviceContainerBuildCount = useServiceContainer(buildApi.getBuildCount);
  const serviceContainerBuildCountRunner = serviceContainerBuildCount.run;

  const refreshBuildCounts = useCallback(() => {
    serviceContainerBuildCountRunner();
    setSecondsUntilReload(REFRESH_INTERVAL_SECONDS);
  }, [serviceContainerBuildCountRunner]);

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
      <Flex direction={directionColumn}>
        <FlexItem>
          <ContentBox isResponsive>
            <ServiceContainerCreatingUpdating {...serviceContainerPncVersionSet} title="PNC version">
              <div className="p-global">
                <Form>
                  <FormGroup label="PNC System Version" fieldId="form-pnc-system-version">
                    <TextInput
                      type="text"
                      id="form-pnc-system-version"
                      name="form-pnc-system-version"
                      value={pncVersion}
                      onChange={(value) => setPncVersion(value)}
                    />
                  </FormGroup>

                  <ActionGroup>
                    <Button
                      variant="primary"
                      id="form-pnc-system-version-update"
                      name="form-pnc-system-version-update"
                      onClick={() => {
                        serviceContainerPncVersionSet.run({
                          serviceData: {
                            version: pncVersion,
                          },
                        });
                      }}
                    >
                      Update Version
                    </Button>
                  </ActionGroup>
                </Form>
              </div>
            </ServiceContainerCreatingUpdating>
          </ContentBox>
        </FlexItem>
        <FlexItem>
          <ContentBox isResponsive>
            <ServiceContainerLoading {...serviceContainerBuildCount} title="Builds count">
              <div className="p-global">
                <Attributes>
                  <AttributesItem title="Running builds count">{serviceContainerBuildCount.data?.running}</AttributesItem>
                  <AttributesItem title="Enqueued builds count">{serviceContainerBuildCount.data?.enqueued}</AttributesItem>
                  <AttributesItem title="Waiting for dependencies builds count">
                    {serviceContainerBuildCount.data?.waitingForDependencies}
                  </AttributesItem>
                </Attributes>
              </div>
            </ServiceContainerLoading>

            <div className="p-global p-t-0">
              <Button
                variant="primary"
                onClick={() => {
                  refreshBuildCounts();
                  restartInterval();
                }}
              >
                Refresh ({secondsUntilReload} s)
              </Button>
            </div>
          </ContentBox>
        </FlexItem>
        <FlexItem>
          <ContentBox isResponsive>
            <ServiceContainerCreatingUpdating {...serviceContainerAnnouncement} title="Announcement">
              <div className="p-global">
                <Form>
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

                  {isMaintenanceModeOn && (
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
                        dateFormat={(date: Date): string => (date ? createDateTime({ date }).custom : '')}
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
                        onChange={(_event: FormEvent<HTMLInputElement>, value: string) => {
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
                  )}

                  {isMaintenanceModeOn && (
                    <TopBarInfo hideCloseButton={true}>
                      Maintenance Mode - PNC system is in the maintenance mode, no new build requests are accepted. Reason:{' '}
                      {announcementMessage ? announcementMessage : N_A}, ETA: {etaTime ? etaTime : N_A}
                    </TopBarInfo>
                  )}
                  {!isMaintenanceModeOn && announcementMessage && (
                    <TopBarInfo hideCloseButton={true}>Announcement - {announcementMessage}</TopBarInfo>
                  )}

                  <ActionGroup>
                    <Button
                      variant="primary"
                      id="form-announcement-update"
                      name="form-announcement-update"
                      onClick={() => {
                        validateForm() &&
                          serviceContainerAnnouncement.run({
                            serviceData: {
                              message: announcementMessage + (isMaintenanceModeOn ? ', ETA: ' + (etaTime ? etaTime : N_A) : ''),
                            },
                          });
                      }}
                    >
                      Update
                    </Button>
                  </ActionGroup>
                </Form>
              </div>
            </ServiceContainerCreatingUpdating>
          </ContentBox>
        </FlexItem>

        <FlexItem>
          <ContentBox padding title="Test UI Logger" isResponsive>
            <Flex spaceItems={spaceItemsXs} direction={directionColumn}>
              <FlexItem>
                <Text>Sends UI log to the UI Logger service - use for testing purposes.</Text>
              </FlexItem>
              <FlexItem>
                <Button
                  variant="primary"
                  onClick={() => {
                    uiLogger.error('Test Log', new Error('Created for testing purposes.'));
                  }}
                >
                  Send UI Log
                </Button>
              </FlexItem>
            </Flex>
          </ContentBox>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
