import { IQParamOperators } from 'utils/qParamHelper';

/**
 * Not all possible combinations are valid.
 *
 * @example
 * {
 *   id: 'name',
 *   title: 'Name',
 *   filter: {
 *     operator: '=like='
 *     placeholder: 'Custom placeholder',
 *   }
 * }
 *
 * @example
 * {
 *   id: 'status',
 *   title: 'Status',
 *   values: ['SUCCESS', 'REJECTED', 'FAILED'],
 *   filter: {
 *     operator: '=='
 *   }
 * }
 *
 * @example
 * {
 *   id: 'customParam',
 *   title: 'Custom Param',
 *   filter: {
 *     operator: '=like='
 *     isCustomParam: true,
 *   }
 * }
 */
export interface IEntityAttribute<T = string> {
  /**
   * ID has to match object key , there is automatic TypeScript based checker throwing errors if they don't match.
   */
  id: T;

  /**
   * Title will be displayed to the user.
   */
  title: string;

  /**
   * Description helping user to understand attribute details.
   */
  tooltip?: string;

  /**
   * Select instead of text input will be displayed.
   */
  values?: any;

  /**
   * Filter related properties. If this property is defined, then entity attribute is automatically used as filtering attribute.
   */
  filter?: {
    /**
     * Additional operators (see IQParamOperators):
     *  - '=like=' valid only when property values are not defined ('=notlike=' is determined automatically when filter value starts with ! character)
     *  - '==' valid only when property values are defined
     *  - '!=' valid only when property values are defined
     */
    operator: IQParamOperators;

    /**
     * When true, custom id based Query Param (not Q) will be used.
     */
    isCustomParam?: boolean;

    /**
     * Placeholder when text input is displayed.
     */
    placeholder?: string;
  };
}

export interface IEntityAttributes {
  [key: string]: IEntityAttribute<typeof key>;
}

export type TEntityAttributes<Entity> = {
  [key in keyof Entity]: IEntityAttribute<key>;
};
