import { Divider, PageBreadcrumb, PageSection, PageSectionVariants, Switch, Text, TextContent } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React, { useState } from 'react';

import { Breadcrumb, IBreadcrumbData } from 'components/Breadcrumb/Breadcrumb';
import { PageWithSidebar } from 'components/PageWithSidebar/PageWithSidebar';

interface IAppLayoutProps {
  title: React.ReactNode;
  description?: React.ReactNode; // not just string, also components can be used
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  breadcrumbs?: IBreadcrumbData[];
  sidebar?: {
    content: React.ReactNode;
    title: string;
  };
}

/**
 * Page layout component containing individual sections.
 *
 * @param children - Body content, for example tables
 * @param title - Page title, for example "Projects"
 * @param description - Page description containing brief page introduction and information about displayed entities
 * @param actions - Actions (for example, buttons) associated with the page
 * @param tabs - Tabs of the sub-pages of the page group
 * @param sidebar - Sidebar panel containing hideable content, typically related to all tabs
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
export const PageLayout = ({
  children,
  title,
  description,
  actions,
  tabs,
  breadcrumbs,
  sidebar,
}: React.PropsWithChildren<IAppLayoutProps>) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  const pageContent = (
    <>
      {breadcrumbs && (
        <PageBreadcrumb>
          <Breadcrumb pageBreadcrumbs={breadcrumbs} />
        </PageBreadcrumb>
      )}
      <PageSection variant={PageSectionVariants.light}>
        <TextContent className={css((actions || sidebar) && 'pull-left m-b-15')}>
          <Text component="h1">{title}</Text>
          <Text component="p">{description}</Text>
        </TextContent>
        {(actions || sidebar) && (
          <div className="pull-right display-flex align-items-center gap-10">
            {actions}
            {sidebar && (
              <Switch
                label={sidebar.title}
                isChecked={isSidebarExpanded}
                onChange={() => setIsSidebarExpanded((isExpanded) => !isExpanded)}
              />
            )}
          </div>
        )}
      </PageSection>

      {tabs}

      <Divider component="div" />

      <PageSection>{children}</PageSection>
    </>
  );

  return (
    <>
      {sidebar ? (
        <PageWithSidebar
          sidebarTitle={sidebar.title}
          sidebarContent={sidebar.content}
          isExpanded={isSidebarExpanded}
          onExpand={setIsSidebarExpanded}
        >
          {pageContent}
        </PageWithSidebar>
      ) : (
        <>{pageContent}</>
      )}
    </>
  );
};
