import { Route, Routes } from 'react-router-dom';

// homepage
import { DashboardPage } from './components/DashboardPage/DashboardPage';

// entity pages
import { ArtifactsPage } from './components/ArtifactsPage/ArtifactsPage';
import { BuildConfigsPage } from './components/BuildConfigsPage/BuildConfigsPage';
import { BuildsPage } from './components/BuildsPage/BuildsPage';
import { GroupBuildsPage } from './components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigsPage } from './components/GroupConfigsPage/GroupConfigsPage';
import { ProductsPage } from './components/ProductsPage/ProductsPage';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { ProjectCreateEditPage } from './components/ProjectCreateEditPage/ProjectCreateEditPage';
import { ScmRepositoriesPage } from './components/ScmRepositoriesPage/ScmRepositoriesPage';
import { ProjectDetailPage } from './components/ProjectDetailPage/ProjectDetailPage';

// special pages
import { DemoPage } from './components/DemoPage/DemoPage';
import { VariablesPage } from './components/VariablesPage/VariablesPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { AdministrationPage } from './components/AdministrationPage/AdministrationPage';
import { keycloakService, AUTH_ROLE } from './services/keycloakService';

interface IProtectedRouteProps {
  role?: AUTH_ROLE;
}

const ProtectedRoute = ({ children, role = AUTH_ROLE.User }: React.PropsWithChildren<IProtectedRouteProps>) => {
  if (keycloakService.isAuthenticated()) {
    if (keycloakService.hasRealmRole(role)) {
      return <>{children}</>;
    } else {
      return <div>User not allowed</div>;
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
          <ProtectedRoute>
            <ProjectCreateEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":projectId/edit"
        element={
          <ProtectedRoute>
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
          <ProtectedRoute role={AUTH_ROLE.Admin}>
            <AdministrationPage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
