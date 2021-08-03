import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';

export const AboutPage = () => {
  return (
    <PageLayout title="About PNC System" description="Information about PNC system">
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="p">
            PNC (PNC System Version: master) | PNC Web UI (UI Version: 1.1.1-SNAPSHOT 27 July 2021 Rev: b46a170) | Red Hat, Inc. ©
            2021
          </Text>
        </TextContent>
      </PageSection>
      <Divider component="div" />
    </PageLayout>
  );
};
