import { AxiosRequestConfig } from 'axios';

export const PageTitles = {
  projects: 'Projects',
  projectDetail: 'Project Detail',
  projectCreate: 'Create Project',
  projectEdit: 'Edit Project',
  products: 'Products',
  productCreate: 'Create Product',
  productEdit: 'Edit Product',
  productVersions: 'Product Versions',
  productVersionCreate: 'Create Product Version',
  productVersionEdit: 'Edit Product Version',
  productMilestones: 'Product Milestones',
  productMilestoneCreate: 'Create Product Milestone',
  productMilestoneEdit: 'Edit Product Milestone',
  productReleaseCreate: 'Create Product Release',
  productReleaseEdit: 'Edit Product Release',
  productReleases: 'Product Releases',
  buildConfigs: 'Build Configs',
  buildConfigRevision: 'Build Config Revision',
  buildConfigCreate: 'Create Build Config',
  buildConfigEdit: 'Edit Build Config',
  buildConfigAddRemoveDependencies: 'Add and remove Build Config dependencies',
  buildConfigAddRemove: 'Add and remove Build Configs',
  groupConfigs: 'Group Configs',
  groupConfigCreate: 'Create Group Config',
  groupConfigEdit: 'Edit Group Config',
  builds: 'Builds',
  buildHistory: 'Build History',
  buildMetrics: 'Build Metrics',
  groupBuilds: 'Group Builds',
  artifacts: 'Artifacts',
  artifactQualityRevisions: 'Quality Revisions',
  scmRepositories: 'SCM Repositories',
  productMilestoneComparison: 'Product Milestone Comparison',
  scmRepositoryCreate: 'Create SCM Repository',
  scmRepositoryEdit: 'Edit SCM Repository',
  administration: 'Administration',
  deliverableAnalyses: 'Deliverable Analyses',
  pageNotFound: 'Page Not Found',
  delimiterSymbol: '·',
  deliverableAnalysisLabelsHistory: 'Labels History',
};

export const ButtonTitles = {
  update: 'Update',
  create: 'Create',
  edit: 'Edit',
  add: 'Add',
  remove: 'Remove',
  view: 'View',
};

export const EntityTitles = {
  artifact: 'Artifact',
  build: 'Build',
  buildConfig: 'Build Config',
  groupBuild: 'Group Build',
  groupConfig: 'Group Config',
  project: 'Project',
  product: 'Product',
  productVersion: 'Product Version',
  productMilestone: 'Milestone',
  productRelease: 'Release',
  scmRepository: 'SCM Repository',
};

export const RepositoryUrls = {
  pncRepository: 'https://github.com/project-ncl/pnc',
  pncWebUiRepository: 'https://github.com/project-ncl/pnc-web-ui-react',
  kafkaRepository: 'https://github.com/project-ncl/kafka-store',
  causewayRepository: 'https://github.com/project-ncl/causeway',
  uiLoggerRepository: 'https://github.com/project-ncl/uilogger',
  repourRepository: 'https://github.com/project-ncl/repour',
  bifrostRepository: 'https://github.com/project-ncl/bifrost',
  dependencyAnalyzerRepository: 'https://github.com/project-ncl/dependency-analysis',
  buildDriverRepository: 'https://github.com/project-ncl/build-driver',
  cleanerRepository: 'https://github.com/project-ncl/cleaner',
  deliverableAnalyzerRepository: 'https://github.com/project-ncl/deliverables-analyzer',
  environmentDriverRepository: 'https://github.com/project-ncl/environment-driver',
  logEventDurationRepository: 'https://github.com/project-ncl/log-event-duration',
  repositoryDriverRepository: 'https://github.com/project-ncl/repository-driver',
  rexRepository: 'https://github.com/project-ncl/rex',
};

// For getting total item count
export const TOTAL_COUNT_REQUEST_CONFIG: AxiosRequestConfig = { params: { pageSize: 0 } };

export const FILTERING_PLACEHOLDER_DEFAULT: string = 'string | !string | s?ring | st*g';

// universal messages
export const MESSAGE_PNC_ADMIN_CONTACT = 'PNC administrators on "PNC Users" channel';
export const MESSAGE_WAIT_AND_REFRESH = 'Wait 5 minutes and try to refresh your browser';

// PNC URL base
export const URL_BASE_PATH = '/pnc-web';
