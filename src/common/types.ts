import {
  BuildConfigCreationResponse,
  BuildConfigPage,
  BuildConfiguration,
  GroupConfiguration,
  RepositoryCreationResponse,
} from 'pnc-api-types-ts';

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export interface ConfigPage<T extends BuildConfiguration | GroupConfiguration> extends Omit<BuildConfigPage, 'content'> {
  content?: T[];
}

// See NCL-8433 , taskId is very large number, convert it to string
export interface RepositoryCreationResponseCustomized extends Omit<RepositoryCreationResponse, 'taskId'> {
  taskId: string;
}
export interface BuildConfigCreationResponseCustomized extends Omit<BuildConfigCreationResponse, 'taskId'> {
  taskId: string;
}

export interface ReasonedBoolean {
  value: boolean;
  reason: string;
}
