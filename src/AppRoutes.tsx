import { Route, Routes } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { AboutPage } from 'components/AboutPage/AboutPage';
import { AdministrationPage } from 'components/AdministrationPage/AdministrationPage';
import { ArtifactsPage } from 'components/ArtifactsPage/ArtifactsPage';
import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';
import { BuildsPage } from 'components/BuildsPage/BuildsPage';
import { DashboardPage } from 'components/DashboardPage/DashboardPage';
import { DemoPage } from 'components/DemoPage/DemoPage';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { GroupBuildsPage } from 'components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';
import { ProductMilestoneBuildsPerformedPage } from 'components/ProductMilestoneBuildsPerformedPage/ProductMilestoneBuildsPerformedPage';
import { ProductMilestoneCloseResultsPage } from 'components/ProductMilestoneCloseResultsPage/ProductMilestoneCloseResultsPage';
import { ProductMilestoneDeliverablesAnalysisPage } from 'components/ProductMilestoneDeliverablesAnalysisPage/ProductMilestoneDeliverablesAnalysisPage';
import { ProductMilestoneDeliveredArtifactsPage } from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactsPage';
import { ProductMilestoneDetailPage } from 'components/ProductMilestoneDetailPage/ProductMilestoneDetailPage';
import { ProductMilestonePages } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ProductsPage } from 'components/ProductsPage/ProductsPage';
import { ProjectCreateEditPage } from 'components/ProjectCreateEditPage/ProjectCreateEditPage';
import { ProjectDetailPage } from 'components/ProjectDetailPage/ProjectDetailPage';
import { ProjectsPage } from 'components/ProjectsPage/ProjectsPage';
import { ProtectedRoute } from 'components/ProtectedContent/ProtectedRoute';
import { ScmRepositoriesPage } from 'components/ScmRepositoriesPage/ScmRepositoriesPage';
import { VariablesPage } from 'components/VariablesPage/VariablesPage';

import { AUTH_ROLE } from 'services/keycloakService';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    {/* entity pages */}
    <Route path="products" element={<ProductsPage />} />
    <Route path="product-milestones/:milestoneId">
      <Route element={<ProductMilestonePages />}>
        <Route path="details" element={<ProductMilestoneDetailPage />} />
        <Route path="builds-performed" element={<ProductMilestoneBuildsPerformedPage />} />
        <Route path="close-results" element={<ProductMilestoneCloseResultsPage />} />
        <Route path="deliverables-analysis" element={<ProductMilestoneDeliverablesAnalysisPage />} />
        <Route path="delivered-artifacts" element={<ProductMilestoneDeliveredArtifactsPage />} />
      </Route>
    </Route>
    <Route path="projects">
      <Route index element={<ProjectsPage />} />
      <Route
        path="create"
        element={
          <ProtectedRoute title={PageTitles.projectCreate}>
            <ProjectCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":projectId/edit"
        element={
          <ProtectedRoute title={PageTitles.projectEdit}>
            <ProjectCreateEditPage editPage={true} />
          </ProtectedRoute>
        }
      />
      <Route path=":projectId" element={<ProjectDetailPage />} />
    </Route>
    <Route path="build-configs" element={<BuildConfigsPage />} />
    <Route path="group-configs" element={<GroupConfigsPage />} />
    <Route path="builds" element={<BuildsPage />} />
    <Route path="group-builds" element={<GroupBuildsPage />} />
    <Route path="artifacts" element={<ArtifactsPage />} />
    <Route path="scm-repositories" element={<ScmRepositoriesPage />} />

    {/* special pages */}
    <Route path="admin">
      <Route path="demo" element={<DemoPage />} />
      <Route path="variables" element={<VariablesPage />} />
      <Route
        path="administration"
        element={
          <ProtectedRoute title="Administration" role={AUTH_ROLE.Admin}>
            <AdministrationPage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="about" element={<AboutPage />} />
    <Route
      path="*"
      element={
        <ErrorPage pageTitle={PageTitles.pageNotFound} errorDescription="The requested resource could not be found."></ErrorPage>
      }
    />
  </Routes>
);
