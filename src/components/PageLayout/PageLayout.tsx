import { Divider, PageBreadcrumb, PageSection, Switch } from '@patternfly/react-core';
import React, { useState } from 'react';

import { Breadcrumb, IBreadcrumbData } from 'components/Breadcrumb/Breadcrumb';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { PageWithSidebar } from 'components/PageWithSidebar/PageWithSidebar';

import styles from './PageLayout.module.css';

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
        <PageBreadcrumb hasBodyWrapper={false}>
          <Breadcrumb pageBreadcrumbs={breadcrumbs} />
        </PageBreadcrumb>
      )}
      <PageSection hasBodyWrapper={false}>
        <div className={styles['page-layout__title-section']}>
          <PageSectionHeader title={title} titleComponent="h1" description={description} />
          {(actions || sidebar) && (
            <div className={styles['page-layout__actions']}>
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
        </div>
      </PageSection>

      {tabs}

      <Divider component="div" />

      <PageSection hasBodyWrapper={false}>
        <div>{children}</div>
      </PageSection>
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
