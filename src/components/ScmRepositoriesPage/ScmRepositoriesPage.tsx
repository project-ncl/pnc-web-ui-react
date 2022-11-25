import { Divider, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';

import { useTitle } from 'hooks/useTitle';

import { PageTitles } from 'utils/PageTitles';

export const ScmRepositoriesPage = () => {
  useTitle(PageTitles.repositories);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">ScmRepositoriesPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
