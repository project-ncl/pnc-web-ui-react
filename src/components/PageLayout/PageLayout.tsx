import { Divider, PageSection, PageSectionVariants, TextContent, Text } from '@patternfly/react-core';

interface IAppLayout {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode; // not just string, also components can be used
}

/**
 * Page layout component containing individual sections.
 *
 * @param children - Body content, for example tables
 * @param title - Page title, for example "Projects"
 * @param description - Page description containing brief page introduction and information about displayed entities
 * 
 * @example
 * ```tsx
 * <PageLayout
      title="Projects"
      description={<>This page contains a standalone projects like <Label>Hibernate</Label></>}
    >
      <CustomBodyContent />
    </PageLayout>
 * ```
 * 
 */
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
