import { IQParamOperators } from 'utils/qParamHelper';

export type TEntityAttributes<Entity> = {
  [key in keyof Entity]: {
    id: key; // object key and id property value matches
    title: string;
    tooltip?: string;
    values?: any;
    filter?: {
      operator: IQParamOperators;
      isCustomParam?: boolean;
    };
  };
};
