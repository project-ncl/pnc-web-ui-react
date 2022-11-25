import { Divider, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';
import { PageTitles } from 'PageTitles';

import { useTitle } from 'hooks/useTitle';

export const BuildConfigsPage = () => {
  useTitle(PageTitles.buildConfig);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">BuildConfigsPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
