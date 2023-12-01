import { AppLayout } from 'AppLayout';
import { Navigate, Route } from 'react-router-dom';

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
import { BuildConfigBuildMetricsPage } from 'components/BuildConfigBuildMetricsPage/BuildConfigBuildMetricsPage';
import { BuildConfigCreateEditPage } from 'components/BuildConfigCreateEditPage/BuildConfigCreateEditPage';
import { BuildConfigDependantsPage } from 'components/BuildConfigDependantsPage/BuildConfigDependantsPage';
import { BuildConfigDependenciesPage } from 'components/BuildConfigDependenciesPage/BuildConfigDependenciesPage';
import { BuildConfigDetailPage } from 'components/BuildConfigDetailPage/BuildConfigDetailPage';
import { BuildConfigGroupConfigsPage } from 'components/BuildConfigGroupConfigsPage/BuildConfigGroupConfigsPage';
import { BuildConfigPages } from 'components/BuildConfigPages/BuildConfigPages';
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
import { GroupBuildDetailPage } from 'components/GroupBuildDetailPage/GroupBuildDetailPage';
import { GroupBuildsPage } from 'components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigDetailPage } from 'components/GroupConfigDetailPage/GroupConfigDetailPage';
import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';
import { KeycloakStatusPage } from 'components/KeycloakStatusPage/KeycloakStatusPage';
import { ProductCreateEditPage } from 'components/ProductCreateEditPage/ProductCreateEditPage';
import { ProductDetailPage } from 'components/ProductDetailPage/ProductDetailPage';
import { ProductMilestoneBuildsPerformedPage } from 'components/ProductMilestoneBuildsPerformedPage/ProductMilestoneBuildsPerformedPage';
import { ProductMilestoneCloseResultDetailPage } from 'components/ProductMilestoneCloseResultDetailPage/ProductMilestoneCloseResultDetailPage';
import { ProductMilestoneCloseResultsPage } from 'components/ProductMilestoneCloseResultsPage/ProductMilestoneCloseResultsPage';
import { ProductMilestoneComparisonPage } from 'components/ProductMilestoneComparisonPage/ProductMilestoneComparisonPage';
import { ProductMilestoneCreateEditPage } from 'components/ProductMilestoneCreateEditPage/ProductMilestoneCreateEditPage';
import { ProductMilestoneDeliverablesAnalysisDetailPage } from 'components/ProductMilestoneDeliverablesAnalysisDetailPage/ProductMilestoneDeliverablesAnalysisDetailPage';
import { ProductMilestoneDeliverablesAnalysisPage } from 'components/ProductMilestoneDeliverablesAnalysisPage/ProductMilestoneDeliverablesAnalysisPage';
import { ProductMilestoneDeliveredArtifactsPage } from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactsPage';
import { ProductMilestoneDetailPage } from 'components/ProductMilestoneDetailPage/ProductMilestoneDetailPage';
import { ProductMilestoneInterconnectionGraphPage } from 'components/ProductMilestoneInterconnectionGraphPage/ProductMilestoneInterconnectionGraphPage';
import { ProductMilestonePages } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ProductReleaseCreateEditPage } from 'components/ProductReleaseCreateEditPage/ProductReleaseCreateEditPage';
import { ProductVersionBuildConfigsEditPage } from 'components/ProductVersionBuildConfigsEditPage/ProductVersionBuildConfigsEditPage';
import { ProductVersionGroupConfigsEditPage } from 'components/ProductVersionBuildConfigsEditPage/ProductVersionGroupConfigsEditPage';
import { ProductVersionBuildConfigsPage } from 'components/ProductVersionBuildConfigsPage/ProductVersionBuildConfigsPage';
import { ProductVersionCreateEditPage } from 'components/ProductVersionCreateEditPage/ProductVersionCreateEditPage';
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

export const AppRoutes = (
  <Route element={<AppLayout />}>
    <Route path="/" element={<DashboardPage />} />
    {/* entity pages */}
    <Route path="products">
      <Route index element={<ProductsPage />} />
      <Route
        path="create"
        element={
          <ProtectedRoute title={PageTitles.productCreate}>
            <ProductCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":productId/edit"
        element={
          <ProtectedRoute title={PageTitles.productEdit}>
            <ProductCreateEditPage isEditPage />
          </ProtectedRoute>
        }
      />
      <Route path=":productId">
        <Route index element={<ProductDetailPage />} />
        <Route path="versions">
          <Route
            path="create"
            element={
              <ProtectedRoute title={PageTitles.productVersionCreate}>
                <ProductVersionCreateEditPage />
              </ProtectedRoute>
            }
          />
          <Route path=":productVersionId">
            <Route
              path="edit"
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionCreateEditPage isEditPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path=":productVersionId" element={<ProductVersionPages />}>
            <Route path="details" element={<ProductVersionDetailPage />} />
            <Route path="milestones" element={<ProductVersionMilestonesPage />} />
            <Route path="releases" element={<ProductVersionReleasesPage />} />
            <Route path="build-configs" element={<ProductVersionBuildConfigsPage />} />
            <Route path="group-configs" element={<ProductVersionGroupConfigsPage />} />
            <Route index element={<Navigate to="details" replace />} />
          </Route>
          <Route path=":productVersionId">
            <Route
              path="build-configs/edit"
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionBuildConfigsEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="group-configs/edit"
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionGroupConfigsEditPage />
                </ProtectedRoute>
              }
            />
            <Route path="milestones">
              <Route
                path="create"
                element={
                  <ProtectedRoute title={PageTitles.productMilestoneCreate}>
                    <ProductMilestoneCreateEditPage />
                  </ProtectedRoute>
                }
              />
              <Route path=":productMilestoneId">
                <Route
                  path="edit"
                  element={
                    <ProtectedRoute title={PageTitles.productMilestoneEdit}>
                      <ProductMilestoneCreateEditPage isEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="close-results/:closeResultId" index element={<ProductMilestoneCloseResultDetailPage />} />
                <Route
                  path="deliverables-analysis/:deliverablesAnalysisId"
                  index
                  element={<ProductMilestoneDeliverablesAnalysisDetailPage />}
                />
              </Route>
              <Route path=":productMilestoneId" element={<ProductMilestonePages />}>
                <Route path="details" element={<ProductMilestoneDetailPage />} />
                <Route path="builds-performed" element={<ProductMilestoneBuildsPerformedPage />} />
                <Route path="close-results" element={<ProductMilestoneCloseResultsPage />} />
                <Route path="deliverables-analysis" element={<ProductMilestoneDeliverablesAnalysisPage />} />
                <Route path="delivered-artifacts" element={<ProductMilestoneDeliveredArtifactsPage />} />
                <Route path="interconnection-graph" element={<ProductMilestoneInterconnectionGraphPage />} />
                <Route index element={<Navigate to="details" replace />} />
              </Route>
            </Route>
            <Route path="releases">
              <Route
                path="create"
                element={
                  <ProtectedRoute title={PageTitles.productReleaseCreate}>
                    <ProductReleaseCreateEditPage />
                  </ProtectedRoute>
                }
              />
              <Route path=":productReleaseId">
                <Route
                  path="edit"
                  element={
                    <ProtectedRoute title={PageTitles.productReleaseEdit}>
                      <ProductReleaseCreateEditPage isEditPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
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
    <Route path="build-configs">
      <Route index element={<BuildConfigsPage />} />
      <Route
        path="create"
        element={
          <ProtectedRoute title={PageTitles.buildConfigCreate}>
            <BuildConfigCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route path=":buildConfigId" element={<BuildConfigPages />}>
        <Route path="details" element={<BuildConfigDetailPage />} />
        <Route path="dependencies" element={<BuildConfigDependenciesPage />} />
        <Route path="dependants" element={<BuildConfigDependantsPage />} />
        <Route path="group-configs" element={<BuildConfigGroupConfigsPage />} />
        <Route path="build-metrics" element={<BuildConfigBuildMetricsPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
    </Route>
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
    <Route path="group-builds">
      <Route index element={<GroupBuildsPage />} />
      <Route path=":groupBuildId" element={<GroupBuildDetailPage />} />
    </Route>
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
    <Route path="system">
      <Route path="keycloak-status" element={<KeycloakStatusPage />} />
    </Route>
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
  </Route>
);
