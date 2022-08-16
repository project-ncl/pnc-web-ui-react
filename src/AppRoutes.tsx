import { AdministrationPage } from './components/AdministrationPage/AdministrationPage';
// entity pages
import { ArtifactsPage } from './components/ArtifactsPage/ArtifactsPage';
import { BuildConfigsPage } from './components/BuildConfigsPage/BuildConfigsPage';
import { BuildsPage } from './components/BuildsPage/BuildsPage';
// homepage
import { DashboardPage } from './components/DashboardPage/DashboardPage';
// special pages
import { DemoPage } from './components/DemoPage/DemoPage';
import { ErrorPage } from './components/ErrorPage/ErrorPage';
import { GroupBuildsPage } from './components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigsPage } from './components/GroupConfigsPage/GroupConfigsPage';
import { ProductsPage } from './components/ProductsPage/ProductsPage';
import { ProjectCreateEditPage } from './components/ProjectCreateEditPage/ProjectCreateEditPage';
import { ProjectDetailPage } from './components/ProjectDetailPage/ProjectDetailPage';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { ScmRepositoriesPage } from './components/ScmRepositoriesPage/ScmRepositoriesPage';
import { VariablesPage } from './components/VariablesPage/VariablesPage';
import { keycloakService, AUTH_ROLE } from './services/keycloakService';
import { PageTitles } from './utils/PageTitles';
import { Route, Routes } from 'react-router-dom';

interface IProtectedRouteProps {
  title: string;
  role?: AUTH_ROLE;
}

const ProtectedRoute = ({ children, title, role = AUTH_ROLE.User }: React.PropsWithChildren<IProtectedRouteProps>) => {
  if (!keycloakService.isKeycloakAvailable) {
    return <ErrorPage pageTitle={title} errorDescription="Keycloak uninitialized."></ErrorPage>;
  }

  if (keycloakService.isAuthenticated()) {
    if (keycloakService.hasRealmRole(role)) {
      return <>{children}</>;
    } else {
      return <ErrorPage pageTitle={title} errorDescription="User not allowed to enter this page."></ErrorPage>;
    }
  } else {
    keycloakService.login().catch(() => {
      throw new Error('Keycloak login failed.');
    });
  }

  return <div>Redirecting to keycloak...</div>;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    {/* entity pages */}
    <Route path="products" element={<ProductsPage />} />
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
    <Route
      path="*"
      element={
        <ErrorPage pageTitle={PageTitles.pageNotFound} errorDescription="The requested resource could not be found."></ErrorPage>
      }
    />
  </Routes>
);
