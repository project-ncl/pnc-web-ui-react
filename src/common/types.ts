import { BuildConfigPage, BuildConfiguration, GroupConfiguration } from 'pnc-api-types-ts';

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export interface ConfigPage<T extends BuildConfiguration | GroupConfiguration> extends Omit<BuildConfigPage, 'content'> {
  content?: T[];
}
