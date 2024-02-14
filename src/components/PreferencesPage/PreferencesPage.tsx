import { Form, FormGroup, Switch } from '@patternfly/react-core';
import { useEffect, useState } from 'react';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { experimentalContentEnabledLocalStorageId } from 'components/ExperimentalContent/ExperimentalContent';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

export const PreferencesPage = () => {
  const [isExperimentalContentEnabled, setIsExperimentalContentEnabled] = useState<boolean>(false);

  useEffect(() => {
    const isEnabled = window.localStorage.getItem(experimentalContentEnabledLocalStorageId) === 'true';
    setIsExperimentalContentEnabled(isEnabled);
  }, []);

  return (
    <PageLayout title="Preferences" description="User preferences can be set here, including content and visual settings.">
      <ContentBox padding>
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
              onChange={(checked) => {
                setIsExperimentalContentEnabled(checked);
                window.localStorage.setItem(experimentalContentEnabledLocalStorageId, `${checked}`);
                window.location.reload();
              }}
            />
          </FormGroup>
        </Form>
      </ContentBox>
    </PageLayout>
  );
};
