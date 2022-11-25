import { Divider, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';

import { useTitle } from 'hooks/useTitle';

import { PageTitles } from 'utils/PageTitles';

export const ArtifactsPage = () => {
  useTitle(PageTitles.artifacts);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">ArtifactsPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
