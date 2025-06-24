import { LabelProps } from '@patternfly/react-core';

/* See PF5 color palettes: https://v5-archive.patternfly.org/design-foundations/colors#patternfly-palettes */
export interface LabelConfig {
  text: string;
  color: LabelProps['color']; // PatternFly label semantic color
  hexColor: string; // Exact hex code for charts/UI
}

export const buildTypeColorMap: Record<string, LabelConfig> = {
  MVN: { text: 'MVN', color: 'gold', hexColor: '#F9E0A2' }, // gold-100
  NPM: { text: 'NPM', color: 'purple', hexColor: '#CBC1FF' }, // purple-100
  GRADLE: { text: 'GRADLE', color: 'cyan', hexColor: '#A2D9D9' }, // cyan-100
  SBT: { text: 'SBT', color: 'grey', hexColor: '#D2D2D2' }, // black-300
};

export const artifactQualityColorMap: Record<string, LabelConfig> = {
  NEW: { text: 'NEW', color: 'grey', hexColor: '#B8BBBE' }, // black-400
  VERIFIED: { text: 'VERIFIED', color: 'blue', hexColor: '#BEE1F4' }, // blue-100
  TESTED: { text: 'TESTED', color: 'green', hexColor: '#BDE5B8' }, // green-100
  DEPRECATED: { text: 'DEPRECATED', color: 'orange', hexColor: '#F4B678' }, // orange-100
  BLACKLISTED: { text: 'BLACKLISTED', color: 'red', hexColor: '#C9190B' }, // red-100
  DELETED: { text: 'DELETED', color: 'red', hexColor: '#7D1007' }, // red-300
  TEMPORARY: { text: 'TEMPORARY', color: 'cyan', hexColor: '#A2D9D9' }, // cyan-100
  IMPORTED: { text: 'IMPORTED', color: 'grey', hexColor: '#F0F0F0' }, // black-200
};

export const repositoryTypeColorMap: Record<string, LabelConfig> = {
  MAVEN: { text: 'MAVEN', color: 'gold', hexColor: '#F9E0A2' }, // gold-100
  GENERIC_PROXY: { text: 'GENERIC_PROXY', color: 'grey', hexColor: '#D2D2D2' }, // black-300
  NPM: { text: 'NPM', color: 'purple', hexColor: '#CBC1FF' }, // purple-100
  COCOA_POD: { text: 'COCOA_POD', color: 'cyan', hexColor: '#A2D9D9' }, // cyan-100
  DISTRIBUTION_ARCHIVE: { text: 'DISTRIBUTION_ARCHIVE', color: 'red', hexColor: '#C9190B' }, // red-100
};

export const operationProgressStatusColorMap: Record<string, LabelConfig> = {
  NEW: { text: 'NEW', color: 'grey', hexColor: '#F0F0F0' }, // black-200
  PENDING: { text: 'PENDING', color: 'grey', hexColor: '#B8BBBE' }, // black-400
  IN_PROGRESS: { text: 'IN PROGRESS', color: 'blue', hexColor: '#BEE1F4' }, // blue-100
  FINISHED: { text: 'FINISHED', color: 'green', hexColor: '#BDE5B8' }, // green-100
};

export const deliverableAnalysisColorMap: Record<string, LabelConfig> = {
  DELETED: { text: 'DELETED', color: 'red', hexColor: '#C9190B' }, // red-100
  SCRATCH: { text: 'SCRATCH', color: 'grey', hexColor: '#D2D2D2' }, // black-300
  RELEASED: { text: 'RELEASED', color: 'blue', hexColor: '#BEE1F4' }, // blue-100
};

export const operationResultColorMap: Record<string, LabelConfig> = {
  SUCCESSFUL: { text: 'SUCCESSFUL', color: 'green', hexColor: '#BDE5B8' }, // green-100
  FAILED: { text: 'FAILED', color: 'orange', hexColor: '#F4B678' }, // orange-100
  REJECTED: { text: 'REJECTED', color: 'orange', hexColor: '#EF9234' }, // orange-300
  CANCELLED: { text: 'CANCELLED', color: 'grey', hexColor: '#B8BBBE' }, // black-400
  TIMEOUT: { text: 'TIMEOUT', color: 'grey', hexColor: '#D2D2D2' }, // black-300
  SYSTEM_ERROR: { text: 'SYSTEM_ERROR', color: 'red', hexColor: '#C9190B' }, // red-100
};
