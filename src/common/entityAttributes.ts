import { IQParamOperators } from 'utils/qParamHelper';

export interface IEntityAttribute<T = string> {
  id: T; // object key and id property value matches
  title: string;
  tooltip?: string;
  values?: any;
  filter?: {
    operator: IQParamOperators;
    isCustomParam?: boolean;
  };
}

export interface IEntityAttributes {
  [key: string]: IEntityAttribute<typeof key>;
}

export type TEntityAttributes<Entity> = {
  [key in keyof Entity]: IEntityAttribute<key>;
};
