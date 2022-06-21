import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';
import { PageTitles } from '../../utils/PageTitles';
import { useTitle } from '../../containers/useTitle';

export const GroupConfigsPage = () => {
  useTitle(PageTitles.groupConfig);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">GroupConfigsPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
