import { Switch, Route } from 'react-router-dom';

// pages
import { ArtifactsPage } from './components/ArtifactsPage/ArtifactsPage';
import { BuildConfigsPage } from './components/BuildConfigsPage/BuildConfigsPage';
import { BuildsPage } from './components/BuildsPage/BuildsPage';
import { DashboardPage } from './components/DashboardPage/DashboardPage';
import { GroupBuildsPage } from './components/GroupBuildsPage/GroupBuildsPage';
import { GroupConfigsPage } from './components/GroupConfigsPage/GroupConfigsPage';
import { ProductsPage } from './components/ProductsPage/ProductsPage';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { ScmRepositoriesPage } from './components/ScmRepositoriesPage/ScmRepositoriesPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';

export const AppRoutes = () => (
  <Switch>
    <Route path="/" exact component={DashboardPage} />
    <Route path="/products" component={ProductsPage} />
    <Route path="/projects" component={ProjectsPage} />
    <Route path="/build-configs" component={BuildConfigsPage} />
    <Route path="/group-configs" component={GroupConfigsPage} />
    <Route path="/builds" component={BuildsPage} />
    <Route path="/group-builds" component={GroupBuildsPage} />
    <Route path="/artifacts" component={ArtifactsPage} />
    <Route path="/scm-repositories" component={ScmRepositoriesPage} />
    <Route path="*" component={NotFoundPage} />
  </Switch>
);
