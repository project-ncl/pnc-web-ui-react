import { Divider, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';

export const ProductsPage = () => {
  useTitle(PageTitles.products);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">ProductsPage</Text>
          <Text component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos unde, accusantium excepturi ad praesentium.
          </Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />

      <PageSection>
        <ContentBox padding>
          <ActionButton link="/products/100/versions/100/milestones/101/details">
            Product Milestone (testing purposes)
          </ActionButton>
        </ContentBox>
      </PageSection>
    </>
  );
};
