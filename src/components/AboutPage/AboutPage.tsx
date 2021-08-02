import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';

export const AboutPage = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">About</Text>
          <Text component="p">
            PNC (PNC System Version: master) | PNC Web UI (UI Version: 1.1.1-SNAPSHOT 27 July 2021 Rev: b46a170) | Red Hat, Inc. ©
            2021
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
