import { Form, FormGroup, Label, Switch, TextInput, TextInputProps } from '@patternfly/react-core';
import { useEffect, useReducer, useState } from 'react';

import { StorageKeys } from 'common/constants';

import { useTitle } from 'hooks/useTitle';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { ExpandableSection } from 'components/ExpandableSection/ExpandableSection';
import { FormInputHelperText } from 'components/FormInputHelperText/FormInputHelperText';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

type TValidated = TextInputProps['validated'];

interface ILoggerLabel {
  value: string;
  changed: boolean;
  validated: TValidated;
  error: boolean;
}

const LOGGER_LABEL_MAX = 15;
const loggerLabelRegex = new RegExp(`^[a-zA-Z0-9-]{0,${LOGGER_LABEL_MAX}}$`);

export const PreferencesPage = () => {
  const [isExperimentalContentEnabled, setIsExperimentalContentEnabled] = useState<boolean>(false);

  useEffect(() => {
    const isEnabled = window.localStorage.getItem(StorageKeys.isExperimentalContentEnabled) === 'true';
    setIsExperimentalContentEnabled(isEnabled);
  }, []);

  useTitle('Preferences');

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [loggerLabel, updateLoggerLabel] = useReducer(
    (state: ILoggerLabel, value: string) => {
      if (loggerLabelRegex.test(value)) {
        setShowAdvanced(true);
        if (value) {
          window.localStorage.setItem(StorageKeys.loggerLabel, `${value}`);
        } else {
          window.localStorage.removeItem(StorageKeys.loggerLabel);
        }
        return {
          value,
          changed: true,
          validated: (value ? 'success' : 'default') as TValidated,
          error: false,
        };
      }
      console.log('Logger Label: invalid value');
      return { ...state, error: true };
    },
    {
      value: window.localStorage.getItem(StorageKeys.loggerLabel) ?? '',
      changed: false,
      validated: 'default',
      error: false,
    }
  );

  return (
    <PageLayout title="Preferences" description="User preferences can be set here, including content and visual settings.">
      <ContentBox padding marginBottom>
        <Form>
          <FormGroup
            label="Experimental content"
            fieldId="experimental-content"
            labelIcon={
              <TooltipWrapper tooltip="Experimental content is potentially unstable, data are either mocked or backend is WIP." />
            }
          >
            <Switch
              id="experimental-content"
              label="Enabled"
              labelOff="Disabled"
              isChecked={isExperimentalContentEnabled}
              onChange={(_, checked) => {
                setIsExperimentalContentEnabled(checked);
                window.localStorage.setItem(StorageKeys.isExperimentalContentEnabled, `${checked}`);
                window.location.reload();
              }}
            />
          </FormGroup>
        </Form>
      </ContentBox>

      <ContentBox marginBottom background={false} shadow={false}>
        <ExpandableSection
          title="Advanced"
          isExpanded={showAdvanced || !!loggerLabel.value}
          onToggle={(isExpanded) => setShowAdvanced(isExpanded)}
        >
          <ContentBox padding>
            <Form>
              {/** Core features like {@link useForm} need to be avoided */}
              <FormGroup
                label="Logger Label"
                fieldId="logger-label"
                labelIcon={<TooltipWrapper tooltip="For debugging purposes only, leave it empty by default." />}
              >
                <TextInput
                  type="text"
                  id="logger-label"
                  name="logger-label"
                  autoComplete="off"
                  value={loggerLabel.value}
                  validated={loggerLabel.validated}
                  onChange={(_, value) => updateLoggerLabel(value)}
                  onBlur={() => {
                    if (loggerLabel.changed) {
                      window.location.reload();
                    }
                  }}
                />
                <FormInputHelperText variant="default" isHidden={!loggerLabel.value && !loggerLabel.error}>
                  Up to {LOGGER_LABEL_MAX} alphanumeric characters and dash symbol are allowed. It's recommended to use Jira
                  number, such as <Label isCompact>NCL-1234</Label>
                </FormInputHelperText>
                <FormInputHelperText variant="error" isHidden={!loggerLabel.error}>
                  The attempt to enter invalid value was rejected.
                </FormInputHelperText>
              </FormGroup>
            </Form>
          </ContentBox>
        </ExpandableSection>
      </ContentBox>
    </PageLayout>
  );
};
