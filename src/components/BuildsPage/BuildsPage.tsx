import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';
import { PageTitles } from '../../utils/PageTitles';
import { useTitle } from '../../containers/useTitle';

export const BuildsPage = () => {
  useTitle(PageTitles.builds);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">BuildsPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
