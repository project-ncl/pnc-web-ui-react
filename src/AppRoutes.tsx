import { Navigate, Route, Routes } from 'react-router-dom';

import { PageTitles } from 'common/constants';

import { AboutPage } from 'components/AboutPage/AboutPage';
import { AdministrationPage } from 'components/AdministrationPage/AdministrationPage';
import { ArtifactDetailPage } from 'components/ArtifactDetailPage/ArtifactDetailPage';
import { ArtifactPages } from 'components/ArtifactPages/ArtifactPages';
import { ArtifactProductMilestonesReleasesPage } from 'components/ArtifactProductMilestonesReleasesPage/ArtifactProductMilestonesReleasesPage';
import { ArtifactUsagesPage } from 'components/ArtifactUsagesPage/ArtifactUsagesPage';
import { ArtifactsPage } from 'components/ArtifactsPage/ArtifactsPage';
import { BuildAlignmentLogPage } from 'components/BuildAlignmentLogPage/BuildAlignmentLogPage';
import { BuildArtifactDependencyGraphPage } from 'components/BuildArtifactDependencyGraphPage/BuildArtifactDependencyGraphPage';
import { BuildArtifactsPage } from 'components/BuildArtifactsPage/BuildArtifactsPage';
import { BuildBrewPushPage } from 'components/BuildBrewPushPage/BuildBrewPushPage';
import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';
import { BuildDependenciesPage } from 'components/BuildDependenciesPage/BuildDependenciesPage';
import { BuildDetailPage } from 'components/BuildDetailPage/BuildDetailPage';
import { BuildLogPage } from 'components/BuildLogPage/BuildLogPage';
import { BuildMetricsPage } from 'components/BuildMetricsPage/BuildMetricsPage';
import { BuildPages } from 'components/BuildPages/BuildPages';
import { BuildsPage } from 'components/BuildsPage/BuildsPage';
import { DashboardPage } from 'components/DashboardPage/DashboardPage';
import { DemoPage } from 'components/DemoPage/DemoPage';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { GroupBuildsPage } from 'components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigDetailPage } from 'components/GroupConfigDetailPage/GroupConfigDetailPage';
import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';
import { ProductDetailPage } from 'components/ProductDetailPage/ProductDetailPage';
import { ProductMilestoneBuildsPerformedPage } from 'components/ProductMilestoneBuildsPerformedPage/ProductMilestoneBuildsPerformedPage';
import { ProductMilestoneCloseResultsPage } from 'components/ProductMilestoneCloseResultsPage/ProductMilestoneCloseResultsPage';
import { ProductMilestoneComparisonPage } from 'components/ProductMilestoneComparisonPage/ProductMilestoneComparisonPage';
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
import { ScmRepositoryCreateEditPage } from 'components/ScmRepositoryCreateEditPage/ScmRepositoryCreateEditPage';
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
    <Route path="group-configs">
      <Route index element={<GroupConfigsPage />} />
      <Route path=":groupConfigId" element={<GroupConfigDetailPage />} />
    </Route>
    <Route path="builds">
      <Route index element={<BuildsPage />} />
      <Route path=":buildId" element={<BuildPages />}>
        <Route path="details" element={<BuildDetailPage />} />
        <Route path="build-log" element={<BuildLogPage />} />
        <Route path="alignment-log" element={<BuildAlignmentLogPage />} />
        <Route path="artifacts" element={<BuildArtifactsPage />} />
        <Route path="dependencies" element={<BuildDependenciesPage />} />
        <Route path="brew-push" element={<BuildBrewPushPage />} />
        <Route path="build-metrics" element={<BuildMetricsPage />} />
        <Route path="artifact-dependency-graph" element={<BuildArtifactDependencyGraphPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
    </Route>
    <Route path="group-builds" element={<GroupBuildsPage />} />
    <Route path="artifacts">
      <Route index element={<ArtifactsPage />} />
      <Route path=":artifactId" element={<ArtifactPages />}>
        <Route path="details" element={<ArtifactDetailPage />} />
        <Route path="usages" element={<ArtifactUsagesPage />} />
        <Route path="milestones" element={<ArtifactProductMilestonesReleasesPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
    </Route>
    <Route path="scm-repositories">
      <Route index element={<ScmRepositoriesPage />} />
      <Route
        path="create"
        element={
          <ProtectedRoute title={PageTitles.scmRepositoryCreate}>
            <ScmRepositoryCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":scmRepositoryId/edit"
        element={
          <ProtectedRoute title={PageTitles.scmRepositoryEdit}>
            <ScmRepositoryCreateEditPage isEditPage />
          </ProtectedRoute>
        }
      />
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
    <Route path="insights">
      <Route path="product-milestone-comparison" element={<ProductMilestoneComparisonPage />} />
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
