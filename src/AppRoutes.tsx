import { Navigate, Route, Routes } from 'react-router-dom';

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
import { ProductDetailPage } from 'components/ProductDetailPage/ProductDetailPage';
import { ProductMilestoneBuildsPerformedPage } from 'components/ProductMilestoneBuildsPerformedPage/ProductMilestoneBuildsPerformedPage';
import { ProductMilestoneCloseResultsPage } from 'components/ProductMilestoneCloseResultsPage/ProductMilestoneCloseResultsPage';
import { ProductMilestoneDeliverablesAnalysisPage } from 'components/ProductMilestoneDeliverablesAnalysisPage/ProductMilestoneDeliverablesAnalysisPage';
import { ProductMilestoneDeliveredArtifactsPage } from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactsPage';
import { ProductMilestoneDetailPage } from 'components/ProductMilestoneDetailPage/ProductMilestoneDetailPage';
import { ProductMilestoneInterconnectionGraphPage } from 'components/ProductMilestoneInterconnectionGraphPage/ProductMilestoneInterconnectionGraphPage';
import { ProductMilestonePages } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ProductVersionBuildConfigsPage } from 'components/ProductVersionBuildConfigsPage/ProductVersionBuildConfigsPage';
import { ProductVersionDetailPage } from 'components/ProductVersionDetailPage/ProductVersionDetailPage';
import { ProductVersionGroupConfigsPage } from 'components/ProductVersionGroupConfigsPage/ProductVersionGroupConfigsPage';
import { ProductVersionMilestonesPage } from 'components/ProductVersionMilestonesPage/ProductVersionMilestonesPage';
import { ProductVersionPages } from 'components/ProductVersionPages/ProductVersionPages';
import { ProductVersionReleasesPage } from 'components/ProductVersionReleasesPage/ProductVersionReleasesPage';
import { ProductsPage } from 'components/ProductsPage/ProductsPage';
import { ProjectCreateEditPage } from 'components/ProjectCreateEditPage/ProjectCreateEditPage';
import { ProjectDetailPage } from 'components/ProjectDetailPage/ProjectDetailPage';
import { ProjectsPage } from 'components/ProjectsPage/ProjectsPage';
import { ProtectedRoute } from 'components/ProtectedContent/ProtectedRoute';
import { ScmRepositoriesPage } from 'components/ScmRepositoriesPage/ScmRepositoriesPage';
import { ScmRepositoryDetailPage } from 'components/ScmRepositoryDetailPage/ScmRepositoryDetailPage';
import { VariablesPage } from 'components/VariablesPage/VariablesPage';

import { AUTH_ROLE } from 'services/keycloakService';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    {/* entity pages */}
    <Route path="products">
      <Route index element={<ProductsPage />} />
      <Route path=":productId">
        <Route index element={<ProductDetailPage />} />
        <Route path="versions/:productVersionId" element={<ProductVersionPages />}>
          <Route path="details" element={<ProductVersionDetailPage />} />
          <Route path="milestones" element={<ProductVersionMilestonesPage />} />
          <Route path="releases" element={<ProductVersionReleasesPage />} />
          <Route path="build-configs" element={<ProductVersionBuildConfigsPage />} />
          <Route path="group-configs" element={<ProductVersionGroupConfigsPage />} />
          <Route index element={<Navigate to="details" replace />} />
        </Route>
        <Route path="versions/:productVersionId">
          <Route path="milestones/:productMilestoneId" element={<ProductMilestonePages />}>
            <Route path="details" element={<ProductMilestoneDetailPage />} />
            <Route path="builds-performed" element={<ProductMilestoneBuildsPerformedPage />} />
            <Route path="close-results" element={<ProductMilestoneCloseResultsPage />} />
            <Route path="deliverables-analysis" element={<ProductMilestoneDeliverablesAnalysisPage />} />
            <Route path="delivered-artifacts" element={<ProductMilestoneDeliveredArtifactsPage />} />
            <Route path="interconnection-graph" element={<ProductMilestoneInterconnectionGraphPage />} />
            <Route index element={<Navigate to="details" replace />} />
          </Route>
        </Route>
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
            <ProjectCreateEditPage isEditPage={true} />
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
    <Route path="scm-repositories">
      <Route index element={<ScmRepositoriesPage />} />
      <Route path=":scmRepositoryId" element={<ScmRepositoryDetailPage />} />
    </Route>

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
