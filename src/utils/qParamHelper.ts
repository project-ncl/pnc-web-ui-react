import { groupBy } from 'lodash-es';

import { uiLogger } from 'services/uiLogger';

import { isString } from 'utils/entityRecognition';

/**
 * Q (RSQL) param helper
 *
 * Both ';' and ',' are supported.
 *
 * @example
 * user.username=like="%u1%";
 * filename=like="%te_t%";
 * filename=like="%te%t%"
 * filename=notlike="%test%";
 * status==REJECTED;
 * temporaryBuild==FALSE;
 * status!=CANCELLED;
 *
 */

export type TQParamValue = string | boolean | number;

/**
 * Operator =like= is converted to =notlike= automatically when qValue starts with ! character.
 */
export type IQParamOperators = '=like=' | '=notlike=' | '==' | '!=' | '=isnull=';

export const isQParamOperator = (value: string): value is IQParamOperators => qParamSupportedOperators.comparison.includes(value);

export type TQParamLogicalOperator = 'and' | 'or';

/**
 * List of all supported RSQL operators.
 */
const qParamSupportedOperators = {
  comparison: ['=like=', '=notlike=', '==', '!=', '=isnull='],
  logical: [',', ';'],
};

const logicalOperatorToQParamMap = {
  and: ';',
  or: ',',
} as const;

const qParamSupportedComparisonOperatorsRegex = new RegExp('(' + qParamSupportedOperators.comparison.join('|') + ')');

/**
 * @example
 * {
 *   name: { logicalOperator: 'and', values: ['"%t1%"', '"%t2%"'] } ,
 *   status: { logicalOperator: 'or', values: ['CANCELLED', 'SYSTEM_ERROR'] }
 * }
 */
export interface IQParamObject {
  [key: string]: { operator: IQParamOperators; logicalOperator: TQParamLogicalOperator; values: string[] };
}

/**
 * Shallow Q Parameter parser.
 *
 * @param qParamString RSQL string: (status==SUCCESS,status==FAILED);(user.username=like="%usern;ame%")'
 *
 * @returns Array of individual RSQL items, parenthesis are omitted:
 *   [
 *     'status==SUCCESS',
 *     'status==FAILED',
 *     'user.username=like="%usern;ame%"'
 *   ]
 */
const parseQParamShallow = (qParamString: string): string[] => {
  const qParamStringSimplified = qParamString.replaceAll(/[()]/g, '');

  const qParamArray: string[] = [];

  if (qParamStringSimplified.length) {
    let isValue = false;
    let currentQ = '';
    for (let i = 0; i < qParamStringSimplified.length; i++) {
      const c = qParamStringSimplified[i];

      // value detection
      if (c === '"') {
        isValue = !isValue;
      }

      /**
       * Ignore logical operators, see {@link qParamSupportedOperators.logical}, when they are part of the value.
       *
       * Typically Environment entities contain characters like `;` in Q param value.
       */
      if (!isValue && qParamSupportedOperators.logical.includes(c)) {
        qParamArray.push(currentQ);
        currentQ = '';
      } else {
        currentQ += c;
      }
    }
    qParamArray.push(currentQ); // add last Q parameter
  }

  return qParamArray;
};

const constructQParamItem = (id: string, value: TQParamValue, operator: IQParamOperators): string => {
  switch (operator) {
    case '=like=':
      // 'ab"c"d' -> 'ab\"c\"d'
      const escapedValue = isString(value) ? value.replaceAll('"', '\\"') : value;

      // #support =notlike=
      // value does NOT contain "% characters yet, they need to be added
      // use '=notlike=' when '=like="%!' exists, otherwise use '=like='
      return (id + operator + '"%' + escapedValue + '%"').replace('=like="%!', '=notlike="%');
    case '==':
      return constructDefaultQParamItem(id, value, operator)
        .replace('==!', '!=')
        .replace(/==null/i, '=isnull=true');
    default:
      return constructDefaultQParamItem(id, value, operator);
  }
};

const constructDefaultQParamItem = (id: string, value: TQParamValue, operator: IQParamOperators): string => {
  return `${id}${operator}${value}`;
};

/**
 * @param qParamString - Array of strings (RSQL expressions): ['name=like="%a%"', 'name=notlike="%b%"', 'description=like="%c%"', 'name=like="%d%"']
 * @returns Joined RSQL string. Items within one group (same id (key)) are joined with AND or OR operator (based on comparison operator), groups are joined with AND operator.
 * Example output: 'name=like="%a%",name=notlike="%b%",name=like="%d%";description=like="%c%"'
 */
const joinQParamItems = (qParamItems: string[]): string => {
  const qParamItemsObjects = qParamItems.map((qParamItem) => {
    const qParamItemSplitted = qParamItem.split(qParamSupportedComparisonOperatorsRegex);
    const [qKey, qOperator, qValue] = [...qParamItemSplitted.splice(0, 2), qParamItemSplitted.join('')];

    return {
      id: qKey,
      operator: qOperator as IQParamOperators,
      value: qValue,
    };
  });

  const qParamItemsObjectsGroupedById = Object.values(groupBy(qParamItemsObjects, 'id'));

  return qParamItemsObjectsGroupedById
    .map((group) => {
      const logicalOperator = selectLogicalOperator(group[0].operator); // all in the group have the same operator
      const groupStringified = group
        .map((item) => `${item.id}${item.operator}${item.value}`)
        .join(logicalOperatorToQParamMap[logicalOperator]);

      // () because: AND precedence > OR precedence
      return `(${groupStringified})`;
    })
    .join(logicalOperatorToQParamMap.and);
};

/**
 * @returns
 * 1) new Q string containing new param
 * 2) null when Q param is already contained in Q string
 */
export const addQParamItem = (
  id: string,
  value: TQParamValue,
  operator: IQParamOperators,
  qParam: string,
  replaceOriginalValue: boolean = false
): string | null => {
  const qParamItemsOriginal = parseQParamShallow(qParam);
  const qParamItems = replaceOriginalValue
    ? qParamItemsOriginal.filter((item) => !item.startsWith(`${id}==`))
    : qParamItemsOriginal;
  const newItem = constructQParamItem(id, value, operator);

  // prevent duplicities
  if (qParamItems.indexOf(newItem) === -1) {
    qParamItems.push(newItem);
  } else {
    return null;
  }

  return joinQParamItems(qParamItems);
};

/**
 * @param qParam - RSQL string: filename=like="%te%t%";status!=CANCELLED
 * @returns
 * 1) New Q string without specified param
 * 2) Empty string when last param was removed
 */
export const removeQParamItem = (id: string, value: TQParamValue, operator: IQParamOperators, qParam: string): string => {
  const qParamItems = parseQParamShallow(qParam);
  // #support =notlike=, !=, and =isnull=
  // value already contains "% characters
  // use '=notlike=' when '=like=!' exists, otherwise use '=like='
  const removeItem = (id + operator + value)
    .replace('=like=!', '=notlike=')
    .replace('==!', '!=')
    .replace(/==null/i, '=isnull=true');
  const removeItemIndex = qParamItems.indexOf(removeItem);

  if (removeItemIndex > -1) {
    qParamItems.splice(removeItemIndex, 1);
  } else {
    uiLogger.error(`${removeItem} removing failed, it does not exist`);
  }

  return joinQParamItems(qParamItems);
};

/**
 * @param qParam - RSQL string: filename=like="%te%t%";status!=CANCELLED
 * @returns Object representing individual RSQL items deeply parsed along with logical operators
 */
export const parseQParamDeep = (qParam: string): IQParamObject => {
  let qParamObject: IQParamObject = {};

  let qParamItems = parseQParamShallow(qParam);

  // loop Q Params Items
  for (let i = 0; i < qParamItems.length; i++) {
    const qParamItemSplitted = qParamItems[i].split(qParamSupportedComparisonOperatorsRegex);
    let [qKey, qOperator, qValue] = [...qParamItemSplitted.slice(0, 2), qParamItemSplitted.slice(2).join('')];

    if (qParamItemSplitted.length >= 3 && isQParamOperator(qOperator)) {
      // add ! character
      // #support =notlike=, !=, and =isnull=
      if (qOperator === '=notlike=' || qOperator === '!=') {
        qValue = '!' + qValue;
        qOperator = qOperator === '=notlike=' ? '=like=' : '==';
      }

      if (qOperator === '=isnull=') {
        qValue = 'null';
        qOperator = '==';
      }

      if (qParamObject[qKey]) {
        qParamObject[qKey].values.push(qValue);
      } else {
        qParamObject[qKey] = {
          operator: qOperator as IQParamOperators,
          logicalOperator: selectLogicalOperator(qOperator as IQParamOperators),
          values: [qValue],
        };
      }
    } else {
      uiLogger.error(
        `${qParamItems[i]} does not contain any valid operator, supported operators are: ${qParamSupportedOperators.comparison}`
      );
    }
  }
  return qParamObject;
};

const selectLogicalOperator = (operator: IQParamOperators): TQParamLogicalOperator => (operator === '==' ? 'or' : 'and');
