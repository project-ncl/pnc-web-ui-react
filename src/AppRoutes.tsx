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
import { DemoPage } from './components/DemoPage/DemoPage';
import { VariablesPage } from './components/VariablesPage/VariablesPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { AdministrationPage } from './components/AdministrationPage/AdministrationPage';

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
    <Route path="admin/demo" element={<DemoPage />} />
    <Route path="admin/variables" element={<VariablesPage />} />
    <Route path="admin/administration" element={<AdministrationPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
