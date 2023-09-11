import { AxiosRequestConfig } from 'axios';

export const PageTitles = {
  projects: 'Projects',
  projectDetail: 'Project Detail',
  projectCreate: 'Create Project',
  projectEdit: 'Update Project',
  products: 'Products',
  productCreate: 'Create Product',
  productEdit: 'Update Product',
  productVersions: 'Product Versions',
  productMilestones: 'Product Milestones',
  productReleases: 'Product Releases',
  buildConfigs: 'Build Configs',
  groupConfigs: 'Group Configs',
  builds: 'Builds',
  buildHistory: 'Build History',
  groupBuilds: 'Group Builds',
  artifacts: 'Artifacts',
  artifactQualityRevisions: 'Quality Revisions',
  scmRepositories: 'SCM Repositories',
  productMilestoneComparison: 'Product Milestone Comparison',
  scmRepositoryCreate: 'Create SCM Repository',
  scmRepositoryEdit: 'Update SCM Repository',
  administration: 'Administration',
  pageNotFound: 'Page Not Found',
  delimiterSymbol: '·',
};

// For getting total item count
export const SINGLE_PAGE_REQUEST_CONFIG: AxiosRequestConfig = { params: { pageSize: 1 } };

export const FILTERING_PLACEHOLDER_DEFAULT: string = 'string | !string | s?ring | st*g';
