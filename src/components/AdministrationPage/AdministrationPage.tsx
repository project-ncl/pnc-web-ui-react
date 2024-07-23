import { ActionGroup, Button, Flex, FlexItem, FlexProps, Form, FormGroup, Switch, Text, TextInput } from '@patternfly/react-core';
import { useCallback, useEffect, useState } from 'react';

import { ButtonTitles } from 'common/constants';
import { pncStatusEntityAttributes } from 'common/pncStatusEntityAttributes';

import { IFieldConfigs, IFieldValues, useForm } from 'hooks/useForm';
import { useInterval } from 'hooks/useInterval';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { FormInput } from 'components/FormInput/FormInput';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { TopBarAnnouncement } from 'components/TopBar/TopBarAnnouncement';

import * as buildApi from 'services/buildApi';
import * as genericSettingsApi from 'services/genericSettingsApi';
import * as githubApi from 'services/githubApi';
import { uiLogger } from 'services/uiLogger';

import { validateDateTime } from 'utils/formValidationHelpers';
import { createDateTime } from 'utils/utils';

const REFRESH_INTERVAL_SECONDS = 90;

const spaceItemsXs: FlexProps['spaceItems'] = { default: 'spaceItemsXs' };
const directionColumn: FlexProps['direction'] = { default: 'column' };

const fieldConfigs = {
  isMaintenanceMode: { value: false },
  eta: {
    validators: [{ validator: validateDateTime, errorMessage: 'Invalid date-time format.' }],
  },
} satisfies IFieldConfigs;

export const AdministrationPage = () => {
  const [secondsUntilReload, setSecondsUntilReload] = useState<number>(0);

  const serviceContainerBuildCount = useServiceContainer(buildApi.getBuildCount);
  const serviceContainerBuildCountRunner = serviceContainerBuildCount.run;

  const serviceContainerCurrentPncWebUiCommit = useServiceContainer(githubApi.getCurrentPncWebUiCommit);
  const serviceContainerCurrentPncWebUiCommitRunner = serviceContainerCurrentPncWebUiCommit.run;

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

  const serviceContainerPncStatusGet = useServiceContainer(genericSettingsApi.getPncStatus);
  const serviceContainerPncStatusGetRunner = serviceContainerPncStatusGet.run;

  const serviceContainerPncStatusSet = useServiceContainer(genericSettingsApi.setPncStatus);

  const { register, setFieldValues, getFieldValue, getFieldErrors, handleSubmit, isSubmitDisabled } = useForm();

  const submitEdit = (data: IFieldValues) => {
    return serviceContainerPncStatusSet
      .run({
        serviceData: {
          data: {
            banner: data.banner,
            isMaintenanceMode: !!data.isMaintenanceMode,
            eta: data.eta ? new Date(data.eta) : null,
          },
        },
      })
      .catch((error: any) => {
        console.error('Failed to update PNC status.');
        throw error;
      });
  };

  useEffect(() => {
    serviceContainerPncStatusGetRunner().then((response) => {
      if (response.status !== 'success') return;

      const pncStatus = response.result.data;
      const eta = pncStatus.eta && createDateTime({ date: pncStatus.eta }).custom;
      setFieldValues({ ...pncStatus, eta });
    });

    serviceContainerCurrentPncWebUiCommitRunner();
  }, [serviceContainerPncStatusGetRunner, setFieldValues, serviceContainerCurrentPncWebUiCommitRunner]);

  useTitle('Administration');

  return (
    <PageLayout title="Administration" description="Administration tools for admin users">
      <Flex direction={directionColumn}>
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
          <ServiceContainerCreatingUpdating
            {...serviceContainerPncStatusSet}
            serviceContainerLoading={serviceContainerPncStatusGet}
          >
            <ContentBox padding isResponsive>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <FormGroup
                  isRequired
                  label={pncStatusEntityAttributes.banner.title}
                  fieldId={pncStatusEntityAttributes.banner.id}
                >
                  <TextInput
                    isRequired
                    type="text"
                    id={pncStatusEntityAttributes.banner.id}
                    name={pncStatusEntityAttributes.banner.id}
                    autoComplete="off"
                    {...register<string>(pncStatusEntityAttributes.banner.id)}
                  />
                  <FormInputHelperText variant="error">{getFieldErrors(pncStatusEntityAttributes.banner.id)}</FormInputHelperText>
                </FormGroup>

                <FormGroup
                  label={pncStatusEntityAttributes.isMaintenanceMode.title}
                  fieldId={pncStatusEntityAttributes.isMaintenanceMode.id}
                >
                  <FormInput<boolean>
                    {...register<boolean>(pncStatusEntityAttributes.isMaintenanceMode.id, fieldConfigs.isMaintenanceMode)}
                    render={({ value, onChange, onBlur }) => (
                      <Switch
                        id={pncStatusEntityAttributes.isMaintenanceMode.id}
                        name={pncStatusEntityAttributes.isMaintenanceMode.id}
                        label="Enabled"
                        labelOff="Disabled"
                        isChecked={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup label={pncStatusEntityAttributes.eta.title} fieldId={pncStatusEntityAttributes.eta.id}>
                  <DatePicker
                    id={pncStatusEntityAttributes.eta.id}
                    name={pncStatusEntityAttributes.eta.id}
                    includeTime
                    {...register<string>(pncStatusEntityAttributes.eta.id, fieldConfigs.eta)}
                  />
                  <FormInputHelperText variant="error">{getFieldErrors(pncStatusEntityAttributes.eta.id)}</FormInputHelperText>
                </FormGroup>

                {!isSubmitDisabled && (
                  <TopBarAnnouncement
                    banner={getFieldValue(pncStatusEntityAttributes.banner.id)}
                    isMaintenanceMode={getFieldValue(pncStatusEntityAttributes.isMaintenanceMode.id)}
                    eta={getFieldValue(pncStatusEntityAttributes.eta.id)}
                    hideCloseButton
                  />
                )}

                <ActionGroup>
                  <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit(submitEdit)}>
                    {ButtonTitles.update}
                  </Button>
                </ActionGroup>
              </Form>
            </ContentBox>
          </ServiceContainerCreatingUpdating>
        </FlexItem>

        <FlexItem>
          <ContentBox padding>
            <Attributes>
              <AttributesItem title="Deployed commit SHA">{process.env.REACT_APP_GIT_SHORT_SHA}</AttributesItem>

              <AttributesItem title="Latest commit SHA">
                <ServiceContainerLoading {...serviceContainerCurrentPncWebUiCommit} variant="icon" title="Latest commit SHA">
                  {serviceContainerCurrentPncWebUiCommit.data?.sha}{' '}
                  {serviceContainerCurrentPncWebUiCommit.data?.sha.startsWith(process.env.REACT_APP_GIT_SHORT_SHA!) && (
                    <>(currently deployed)</>
                  )}
                </ServiceContainerLoading>
              </AttributesItem>

              <AttributesItem title="Latest commit message">
                <ServiceContainerLoading {...serviceContainerCurrentPncWebUiCommit} variant="icon" title="Latest commit message">
                  {serviceContainerCurrentPncWebUiCommit.data?.commit.message}
                </ServiceContainerLoading>
              </AttributesItem>
            </Attributes>
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
