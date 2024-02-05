import { Switch } from '@patternfly/react-core';
import { useEffect, useState } from 'react';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { experimentalContentEnabledLocalStorageId } from 'components/ExperimentalContent/ExperimentalContent';
import { PageLayout } from 'components/PageLayout/PageLayout';

export const PreferencesPage = () => {
  const [isExperimentalContentEnabled, setIsExperimentalContentEnabled] = useState<boolean>(false);

  useEffect(() => {
    const isEnabled = window.localStorage.getItem(experimentalContentEnabledLocalStorageId) === 'true';
    setIsExperimentalContentEnabled(isEnabled);
  }, []);

  return (
    <PageLayout title="Preferences">
      <ContentBox padding>
        <Switch
          label="Show experimental content"
          isChecked={isExperimentalContentEnabled}
          onChange={(checked) => {
            setIsExperimentalContentEnabled(checked);
            window.localStorage.setItem(experimentalContentEnabledLocalStorageId, `${checked}`);
            window.location.reload();
          }}
        />
      </ContentBox>
    </PageLayout>
  );
};
