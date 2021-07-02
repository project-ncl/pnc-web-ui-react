import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';

interface IAppLayout {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const PageLayout: React.FunctionComponent<IAppLayout> = ({ children, title, description }) => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{title}</Text>
          <Text component="p">{description}</Text>
        </TextContent>
      </PageSection>

      <Divider component="div" />

      <PageSection>{children}</PageSection>
    </>
  );
};
