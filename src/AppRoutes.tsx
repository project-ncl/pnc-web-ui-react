import { AppLayout } from 'AppLayout';
import { Navigate, Route } from 'react-router';

import { breadcrumbData } from 'common/breadcrumbData';
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
import { BuildConfigDependenciesEditPage } from 'components/BuildConfigDependenciesEditPage/BuildConfigDependenciesEditPage';
import { BuildConfigDependenciesPage } from 'components/BuildConfigDependenciesPage/BuildConfigDependenciesPage';
import { BuildConfigRevisionPage } from 'components/BuildConfigDetailPage/BuilConfigRevisionPage';
import { BuildConfigDetailPage } from 'components/BuildConfigDetailPage/BuildConfigDetailPage';
import { BuildConfigGroupConfigsPage } from 'components/BuildConfigGroupConfigsPage/BuildConfigGroupConfigsPage';
import { BuildConfigPages } from 'components/BuildConfigPages/BuildConfigPages';
import { BuildConfigRevisionPages } from 'components/BuildConfigRevisionPages/BuildConfigRevisionPages';
import { BuildConfigsPage } from 'components/BuildConfigsPage/BuildConfigsPage';
import { BuildDependenciesPage } from 'components/BuildDependenciesPage/BuildDependenciesPage';
import { BuildDetailPage } from 'components/BuildDetailPage/BuildDetailPage';
import { BuildLogPage } from 'components/BuildLogPage/BuildLogPage';
import { BuildMetricsPage } from 'components/BuildMetricsPage/BuildMetricsPage';
import { BuildPages } from 'components/BuildPages/BuildPages';
import { BuildsPage } from 'components/BuildsPage/BuildsPage';
import { DashboardPage } from 'components/DashboardPage/DashboardPage';
import { DeliverableAnalysesPage } from 'components/DeliverableAnalysesPage/DeliverableAnalysesPage';
import { DeliverableAnalysisDeliveredArtifactsPage } from 'components/DeliverableAnalysisDeliveredArtifactsPage/DeliverableAnalysisDeliveredArtifactsPage';
import { DeliverableAnalysisDetailPage } from 'components/DeliverableAnalysisDetailPage/DeliverableAnalysisDetailPage';
import { DeliverableAnalysisPages } from 'components/DeliverableAnalysisPages/DeliverableAnalysisPages';
import { DemoPage } from 'components/DemoPage/DemoPage';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { GroupBuildDetailPage } from 'components/GroupBuildDetailPage/GroupBuildDetailPage';
import { GroupBuildsPage } from 'components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigBuildConfigsEditPage } from 'components/GroupConfigBuildConfigsEditPage/GroupConfigBuildConfigsEditPage';
import { GroupConfigCreateEditPage } from 'components/GroupConfigCreateEditPage/GroupConfigCreateEditPage';
import { GroupConfigDetailPage } from 'components/GroupConfigDetailPage/GroupConfigDetailPage';
import { GroupConfigsPage } from 'components/GroupConfigsPage/GroupConfigsPage';
import { KeycloakStatusPage } from 'components/KeycloakStatusPage/KeycloakStatusPage';
import { LiveBuildLogPage } from 'components/LiveBuildLogPage/LiveBuildLogPage';
import { PreferencesPage } from 'components/PreferencesPage/PreferencesPage';
import { ProductCreateEditPage } from 'components/ProductCreateEditPage/ProductCreateEditPage';
import { ProductDetailPage } from 'components/ProductDetailPage/ProductDetailPage';
import { ProductMilestoneBuildsPerformedPage } from 'components/ProductMilestoneBuildsPerformedPage/ProductMilestoneBuildsPerformedPage';
import { ProductMilestoneCloseResultDetailPage } from 'components/ProductMilestoneCloseResultDetailPage/ProductMilestoneCloseResultDetailPage';
import { ProductMilestoneCloseResultsPage } from 'components/ProductMilestoneCloseResultsPage/ProductMilestoneCloseResultsPage';
import { ProductMilestoneComparisonPage } from 'components/ProductMilestoneComparisonPage/ProductMilestoneComparisonPage';
import { ProductMilestoneCreateEditPage } from 'components/ProductMilestoneCreateEditPage/ProductMilestoneCreateEditPage';
import { ProductMilestoneDeliverableAnalysesPage } from 'components/ProductMilestoneDeliverableAnalysesPage/ProductMilestoneDeliverableAnalysesPage';
import { ProductMilestoneDeliveredArtifactsPage } from 'components/ProductMilestoneDeliveredArtifactsPage/ProductMilestoneDeliveredArtifactsPage';
import { ProductMilestoneDetailPage } from 'components/ProductMilestoneDetailPage/ProductMilestoneDetailPage';
import { ProductMilestoneInterconnectionGraphPage } from 'components/ProductMilestoneInterconnectionGraphPage/ProductMilestoneInterconnectionGraphPage';
import { ProductMilestonePages } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ProductReleaseCreateEditPage } from 'components/ProductReleaseCreateEditPage/ProductReleaseCreateEditPage';
import { ProductVersionBuildConfigsEditPage } from 'components/ProductVersionBuildConfigsEditPage/ProductVersionBuildConfigsEditPage';
import { ProductVersionBuildConfigsPage } from 'components/ProductVersionBuildConfigsPage/ProductVersionBuildConfigsPage';
import { ProductVersionCreateEditPage } from 'components/ProductVersionCreateEditPage/ProductVersionCreateEditPage';
import { ProductVersionDetailPage } from 'components/ProductVersionDetailPage/ProductVersionDetailPage';
import { ProductVersionGroupConfigsEditPage } from 'components/ProductVersionGroupConfigsEditPage/ProductVersionGroupConfigsEditPage';
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
    <Route path="products" handle={breadcrumbData.products.id}>
      <Route index element={<ProductsPage />} />
      <Route
        path="create"
        handle={breadcrumbData.create.id}
        element={
          <ProtectedRoute title={PageTitles.productCreate}>
            <ProductCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":productId/edit"
        handle={breadcrumbData.product.id}
        element={
          <ProtectedRoute title={PageTitles.productEdit}>
            <ProductCreateEditPage isEditPage />
          </ProtectedRoute>
        }
      />
      <Route path=":productId" handle={breadcrumbData.product.id}>
        <Route index element={<ProductDetailPage />} />
        <Route path="versions">
          <Route
            path="create"
            handle={breadcrumbData.create.id}
            element={
              <ProtectedRoute title={PageTitles.productVersionCreate}>
                <ProductVersionCreateEditPage />
              </ProtectedRoute>
            }
          />
          <Route path=":productVersionId">
            <Route
              path="edit"
              handle={breadcrumbData.productVersion.id}
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionCreateEditPage isEditPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path=":productVersionId" element={<ProductVersionPages />} handle={breadcrumbData.productVersion.id}>
            <Route path="details" element={<ProductVersionDetailPage />} />
            <Route path="milestones" element={<ProductVersionMilestonesPage />} />
            <Route path="releases" element={<ProductVersionReleasesPage />} />
            <Route path="build-configs" element={<ProductVersionBuildConfigsPage />} />
            <Route path="group-configs" element={<ProductVersionGroupConfigsPage />} />
            <Route index element={<Navigate to="details" replace />} />
          </Route>
          <Route path=":productVersionId" handle={breadcrumbData.productVersion.id}>
            <Route
              path="build-configs/edit"
              handle={breadcrumbData.buildConfigs.id}
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionBuildConfigsEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="group-configs/edit"
              handle={breadcrumbData.groupConfigs.id}
              element={
                <ProtectedRoute title={PageTitles.productVersionEdit}>
                  <ProductVersionGroupConfigsEditPage />
                </ProtectedRoute>
              }
            />
            <Route path="milestones">
              <Route
                path="create"
                handle={breadcrumbData.create.id}
                element={
                  <ProtectedRoute title={PageTitles.productMilestoneCreate}>
                    <ProductMilestoneCreateEditPage />
                  </ProtectedRoute>
                }
              />
              <Route path=":productMilestoneId">
                <Route
                  path="edit"
                  handle={breadcrumbData.productMilestone.id}
                  element={
                    <ProtectedRoute title={PageTitles.productMilestoneEdit}>
                      <ProductMilestoneCreateEditPage isEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="close-results/:closeResultId"
                  index
                  handle={breadcrumbData.productMilestone.id}
                  element={<ProductMilestoneCloseResultDetailPage />}
                />
              </Route>
              <Route path=":productMilestoneId" element={<ProductMilestonePages />} handle={breadcrumbData.productMilestone.id}>
                <Route path="details" element={<ProductMilestoneDetailPage />} />
                <Route path="builds-performed" element={<ProductMilestoneBuildsPerformedPage />} />
                <Route path="close-results" element={<ProductMilestoneCloseResultsPage />} />
                <Route path="deliverable-analyses" element={<ProductMilestoneDeliverableAnalysesPage />} />
                <Route path="delivered-artifacts" element={<ProductMilestoneDeliveredArtifactsPage />} />
                <Route path="interconnection-graph" element={<ProductMilestoneInterconnectionGraphPage />} />
                <Route index element={<Navigate to="details" replace />} />
              </Route>
            </Route>
            <Route path="releases" handle={breadcrumbData.productRelease.id}>
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
    <Route path="projects" handle={breadcrumbData.projects.id}>
      <Route index element={<ProjectsPage />} />
      <Route
        path="create"
        handle={breadcrumbData.create.id}
        element={
          <ProtectedRoute title={PageTitles.projectCreate}>
            <ProjectCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route path=":projectId">
        <Route index element={<ProjectDetailPage />} handle={breadcrumbData.project.id} />
        <Route
          path="edit"
          handle={breadcrumbData.project.id}
          element={
            <ProtectedRoute title={PageTitles.projectEdit}>
              <ProjectCreateEditPage isEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="build-configs/create"
          handle={breadcrumbData.project.id}
          element={
            <ProtectedRoute title={PageTitles.buildConfigCreate}>
              <BuildConfigCreateEditPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
    <Route path="build-configs" handle={breadcrumbData.buildConfigs.id}>
      <Route index element={<BuildConfigsPage />} />
      <Route path=":buildConfigId" element={<BuildConfigPages />} handle={breadcrumbData.buildConfig.id}>
        <Route path="details" element={<BuildConfigDetailPage />} />
        <Route path="dependencies" element={<BuildConfigDependenciesPage />} />
        <Route path="dependants" element={<BuildConfigDependantsPage />} />
        <Route path="group-configs" element={<BuildConfigGroupConfigsPage />} />
        <Route path="revisions" element={<BuildConfigRevisionPages />}>
          <Route path=":revisionId" element={<BuildConfigRevisionPage />} />
        </Route>
        <Route path="build-metrics" element={<BuildConfigBuildMetricsPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
      <Route path=":buildConfigId">
        <Route
          path="edit"
          handle={breadcrumbData.buildConfig.id}
          element={
            <ProtectedRoute title={PageTitles.buildConfigEdit}>
              <BuildConfigCreateEditPage isEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dependencies/edit"
          handle={breadcrumbData.buildConfig.id}
          element={
            <ProtectedRoute title={PageTitles.buildConfigEdit}>
              <BuildConfigDependenciesEditPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
    <Route path="group-configs" handle={breadcrumbData.groupConfigs.id}>
      <Route index element={<GroupConfigsPage />} />
      <Route path=":groupConfigId">
        <Route index element={<GroupConfigDetailPage />} handle={breadcrumbData.groupConfig.id} />
        <Route
          path="edit"
          handle={breadcrumbData.groupConfig.id}
          element={
            <ProtectedRoute title={PageTitles.groupConfigEdit}>
              <GroupConfigCreateEditPage isEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="build-configs/edit"
          handle={breadcrumbData.groupConfig.id}
          element={
            <ProtectedRoute title={PageTitles.groupConfigEdit}>
              <GroupConfigBuildConfigsEditPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="create"
        handle={breadcrumbData.create.id}
        element={
          <ProtectedRoute title={PageTitles.groupConfigCreate}>
            <GroupConfigCreateEditPage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="builds" handle={breadcrumbData.builds.id}>
      <Route index element={<BuildsPage />} />
      <Route path=":buildId" element={<BuildPages />} handle={breadcrumbData.build.id}>
        <Route path="live-log" element={<LiveBuildLogPage />} />
        <Route path="details" element={<BuildDetailPage />} />
        <Route path="build-log" element={<BuildLogPage />} />
        <Route path="alignment-log" element={<BuildAlignmentLogPage />} />
        <Route path="artifacts" element={<BuildArtifactsPage />} />
        <Route path="dependencies" element={<BuildDependenciesPage />} />
        <Route path="brew-push" element={<BuildBrewPushPage />} />
        <Route path="build-metrics" element={<BuildMetricsPage />} />
        <Route
          path="artifact-dependency-graph"
          element={
            <ExperimentalContent isRouteVariant>
              <BuildArtifactDependencyGraphPage />
            </ExperimentalContent>
          }
        />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
    </Route>
    <Route path="group-builds" handle={breadcrumbData.groupBuilds.id}>
      <Route index element={<GroupBuildsPage />} />
      <Route path=":groupBuildId" element={<GroupBuildDetailPage />} handle={breadcrumbData.groupBuild.id} />
    </Route>
    <Route path="artifacts" handle={breadcrumbData.artifacts.id}>
      <Route index element={<ArtifactsPage />} />
      <Route path=":artifactId" element={<ArtifactPages />} handle={breadcrumbData.artifact.id}>
        <Route path="details" element={<ArtifactDetailPage />} />
        <Route path="usages" element={<ArtifactUsagesPage />} />
        <Route path="milestones" element={<ArtifactProductMilestonesReleasesPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
    </Route>
    <Route path="scm-repositories" handle={breadcrumbData.scmRepositories.id}>
      <Route index element={<ScmRepositoriesPage />} />
      <Route
        path="create"
        handle={breadcrumbData.create.id}
        element={
          <ProtectedRoute title={PageTitles.scmRepositoryCreate}>
            <ScmRepositoryCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":scmRepositoryId/edit"
        handle={breadcrumbData.scmRepository.id}
        element={
          <ProtectedRoute title={PageTitles.scmRepositoryEdit}>
            <ScmRepositoryCreateEditPage isEditPage />
          </ProtectedRoute>
        }
      />
      <Route path=":scmRepositoryId" element={<ScmRepositoryDetailPage />} handle={breadcrumbData.scmRepository.id} />
    </Route>
    <Route path="deliverable-analyses" handle={breadcrumbData.deliverableAnalyses.id}>
      <Route index element={<DeliverableAnalysesPage />} />
      <Route
        path=":deliverableAnalysisId"
        handle={breadcrumbData.deliverableAnalysisDetail.id}
        element={<DeliverableAnalysisPages />}
      >
        <Route path="details" element={<DeliverableAnalysisDetailPage />} />
        <Route path="delivered-artifacts" element={<DeliverableAnalysisDeliveredArtifactsPage />} />
        <Route index element={<Navigate to="details" replace />} />
      </Route>
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
    <Route path="preferences" element={<PreferencesPage />} />
    <Route
      path="*"
      element={
        <ErrorPage pageTitle={PageTitles.pageNotFound} errorDescription="The requested resource could not be found."></ErrorPage>
      }
    />
  </Route>
);
