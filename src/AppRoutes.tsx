import { Switch, Route } from 'react-router-dom';

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
import { AboutPage } from './components/AboutPage/AboutPage';
import { AdministrationPage } from './components/AdministrationPage/AdministrationPage';

export const AppRoutes = () => (
  <Switch>
    <Route path="/" exact component={DashboardPage} />

    {/* entity pages */}
    <Route path="/products" component={ProductsPage} />
    <Route path="/projects" component={ProjectsPage} />
    <Route path="/build-configs" component={BuildConfigsPage} />
    <Route path="/group-configs" component={GroupConfigsPage} />
    <Route path="/builds" component={BuildsPage} />
    <Route path="/group-builds" component={GroupBuildsPage} />
    <Route path="/artifacts" component={ArtifactsPage} />
    <Route path="/scm-repositories" component={ScmRepositoriesPage} />
    <Route path="/about" component={AboutPage} />

    {/* special pages */}
    <Route path="/admin/variables" component={VariablesPage} />
    <Route path="/admin/administration" component={AdministrationPage} />
    <Route path="*" component={NotFoundPage} />
  </Switch>
);
