import { LabelProps } from '@patternfly/react-core';

const grayColor = '--pf-t--global--color--nonstatus--gray--default';

const redColor = '--pf-t--global--color--nonstatus--red--default';

const greenColor = '--pf-t--global--color--nonstatus--green--default';

const blueColor = '--pf-t--global--color--nonstatus--blue--default';

const yellowColor = '--pf-t--global--color--nonstatus--yellow--default';

const orangeColor = '--pf-t--global--color--nonstatus--orange--default';

const tealColor = '--pf-t--global--color--nonstatus--teal--default';

const purpleColor = '--pf-t--global--color--nonstatus--purple--default';

export interface LabelConfig {
  text: string;
  color: LabelProps['color']; // PatternFly label semantic color
  hexColor: string; // Hex code or CSS var for charts/UI
}

export const buildTypeColorMap: Record<string, LabelConfig> = {
  MVN: { text: 'MVN', color: 'yellow', hexColor: yellowColor },
  NPM: { text: 'NPM', color: 'purple', hexColor: purpleColor },
  GRADLE: { text: 'GRADLE', color: 'teal', hexColor: tealColor },
  SBT: { text: 'SBT', color: 'grey', hexColor: grayColor },
  MVN_RPM: { text: 'MVN_RPM', color: 'orange', hexColor: orangeColor },
};

export const artifactQualityColorMap: Record<string, LabelConfig> = {
  NEW: { text: 'NEW', color: 'grey', hexColor: grayColor },
  VERIFIED: { text: 'VERIFIED', color: 'blue', hexColor: blueColor },
  TESTED: { text: 'TESTED', color: 'green', hexColor: greenColor },
  DEPRECATED: { text: 'DEPRECATED', color: 'orange', hexColor: orangeColor },
  BLACKLISTED: { text: 'BLACKLISTED', color: 'red', hexColor: redColor },
  DELETED: { text: 'DELETED', color: 'red', hexColor: redColor },
  TEMPORARY: { text: 'TEMPORARY', color: 'teal', hexColor: tealColor },
  IMPORTED: { text: 'IMPORTED', color: 'grey', hexColor: grayColor },
};

export const repositoryTypeColorMap: Record<string, LabelConfig> = {
  MAVEN: { text: 'MAVEN', color: 'yellow', hexColor: yellowColor },
  GENERIC_PROXY: { text: 'GENERIC_PROXY', color: 'grey', hexColor: grayColor },
  NPM: { text: 'NPM', color: 'purple', hexColor: purpleColor },
  COCOA_POD: { text: 'COCOA_POD', color: 'teal', hexColor: tealColor },
  DISTRIBUTION_ARCHIVE: { text: 'DISTRIBUTION_ARCHIVE', color: 'red', hexColor: redColor },
};

export const operationProgressStatusColorMap: Record<string, LabelConfig> = {
  NEW: { text: 'NEW', color: 'grey', hexColor: grayColor },
  PENDING: { text: 'PENDING', color: 'grey', hexColor: grayColor },
  IN_PROGRESS: { text: 'IN PROGRESS', color: 'blue', hexColor: blueColor },
  FINISHED: { text: 'FINISHED', color: 'green', hexColor: greenColor },
};

export const deliverableAnalysisColorMap: Record<string, LabelConfig> = {
  DELETED: { text: 'DELETED', color: 'red', hexColor: redColor },
  SCRATCH: { text: 'SCRATCH', color: 'grey', hexColor: grayColor },
  RELEASED: { text: 'RELEASED', color: 'blue', hexColor: blueColor },
};

export const operationResultColorMap: Record<string, LabelConfig> = {
  SUCCESSFUL: { text: 'SUCCESSFUL', color: 'green', hexColor: greenColor },
  FAILED: { text: 'FAILED', color: 'orange', hexColor: orangeColor },
  REJECTED: { text: 'REJECTED', color: 'orange', hexColor: orangeColor },
  CANCELLED: { text: 'CANCELLED', color: 'grey', hexColor: grayColor },
  TIMEOUT: { text: 'TIMEOUT', color: 'grey', hexColor: grayColor },
  SYSTEM_ERROR: { text: 'SYSTEM_ERROR', color: 'red', hexColor: redColor },
};
