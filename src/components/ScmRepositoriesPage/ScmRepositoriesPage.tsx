import { Divider, PageSection, PageSectionVariants, Text, TextContent } from '@patternfly/react-core';

import { PageTitles } from 'common/constants';

import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { ContentBox } from 'components/ContentBox/ContentBox';

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

      <PageSection>
        <ContentBox padding>
          <ActionButton link="/scm-repositories/553">SCM Repository (testing purposes)</ActionButton>
        </ContentBox>
      </PageSection>
    </>
  );
};
