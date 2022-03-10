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
import { ScmRepositoriesPage } from './components/ScmRepositoriesPage/ScmRepositoriesPage';

// special pages
import { VariablesPage } from './components/VariablesPage/VariablesPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { AdministrationPage } from './components/AdministrationPage/AdministrationPage';
import { keycloakService, AUTH_ROLE } from './services/keycloakService';

interface IProtectedRouteProps {
  role: AUTH_ROLE;
}

const ProtectedRoute = ({ children, role }: React.PropsWithChildren<IProtectedRouteProps>) => {
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
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="build-configs" element={<BuildConfigsPage />} />
    <Route path="group-configs" element={<GroupConfigsPage />} />
    <Route path="builds" element={<BuildsPage />} />
    <Route path="group-builds" element={<GroupBuildsPage />} />
    <Route path="artifacts" element={<ArtifactsPage />} />
    <Route path="scm-repositories" element={<ScmRepositoriesPage />} />

    {/* special pages */}
    <Route path="admin/variables" element={<VariablesPage />} />
    <Route
      path="admin/administration"
      element={
        <ProtectedRoute role={AUTH_ROLE.Admin}>
          <AdministrationPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
