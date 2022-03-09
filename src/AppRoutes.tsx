import { Navigate, Route, Routes } from 'react-router-dom';

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

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/pnc-web" />} />
    <Route path="/pnc-web" element={<DashboardPage />} />
    {/* entity pages */}
    <Route path="/pnc-web/products" element={<ProductsPage />} />
    <Route path="/pnc-web/projects" element={<ProjectsPage />} />
    <Route path="/pnc-web/build-configs" element={<BuildConfigsPage />} />
    <Route path="/pnc-web/group-configs" element={<GroupConfigsPage />} />
    <Route path="/pnc-web/builds" element={<BuildsPage />} />
    <Route path="/pnc-web/group-builds" element={<GroupBuildsPage />} />
    <Route path="/pnc-web/artifacts" element={<ArtifactsPage />} />
    <Route path="/pnc-web/scm-repositories" element={<ScmRepositoriesPage />} />

    {/* special pages */}
    <Route path="/pnc-web/admin/variables" element={<VariablesPage />} />
    <Route path="/pnc-web/admin/administration" element={<AdministrationPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
