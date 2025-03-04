import { ButtonTitles, EntityTitles, PageTitles } from 'common/constants';

type TBreadcrumbData = {
  [entity: string]: {
    id: string;
    title: string;
  };
};

export const breadcrumbData = {
  products: {
    id: 'products',
    title: PageTitles.products,
  },
  product: {
    id: 'product',
    title: EntityTitles.product,
  },
  productVersion: {
    id: 'productVersion',
    title: EntityTitles.productVersion,
  },
  productMilestone: {
    id: 'productMilestone',
    title: EntityTitles.productMilestone,
  },
  productMilestones: {
    id: 'productMilestones',
    title: PageTitles.productMilestones,
  },
  productRelease: {
    id: 'productRelease',
    title: EntityTitles.productRelease,
  },
  projects: {
    id: 'projects',
    title: PageTitles.projects,
  },
  project: {
    id: 'project',
    title: EntityTitles.project,
  },
  buildConfigs: {
    id: 'buildConfigs',
    title: PageTitles.buildConfigs,
  },
  buildConfig: {
    id: 'buildConfig',
    title: EntityTitles.buildConfig,
  },
  groupConfigs: {
    id: 'groupConfigs',
    title: PageTitles.groupConfigs,
  },
  groupConfig: {
    id: 'groupConfig',
    title: EntityTitles.groupConfig,
  },
  builds: {
    id: 'builds',
    title: PageTitles.builds,
  },
  build: {
    id: 'build',
    title: EntityTitles.build,
  },
  groupBuilds: {
    id: 'groupBuilds',
    title: PageTitles.groupBuilds,
  },
  groupBuild: {
    id: 'groupBuild',
    title: EntityTitles.groupBuild,
  },
  artifacts: {
    id: 'artifacts',
    title: PageTitles.artifacts,
  },
  artifact: {
    id: 'artifact',
    title: EntityTitles.artifact,
  },
  scmRepositories: {
    id: 'scmRepositories',
    title: PageTitles.scmRepositories,
  },
  scmRepository: {
    id: 'scmRepository',
    title: EntityTitles.scmRepository,
  },
  closeResult: {
    id: 'closeResult',
    title: 'Close Result',
  },
  closeResults: {
    id: 'closeResults',
    title: 'Close Results',
  },
  deliverableAnalyses: {
    id: 'deliverableAnalyses',
    title: 'Deliverable Analyses',
  },
  deliverableAnalysisDetail: {
    id: 'deliverableAnalysisDetail',
    title: 'Deliverable Analysis Detail',
  },
  create: {
    id: 'create',
    title: ButtonTitles.create,
  },
  edit: {
    id: 'edit',
    title: 'Edit',
  },
} as const satisfies TBreadcrumbData;

export type TBreadcrumb = keyof typeof breadcrumbData;
