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
 * Operator =like= is converted to =notlike= automatically when qValue starts with ! character,
 * there is no need to declare it manually.
 */
export type IQParamOperators = '=like=' | '==' | '!=' | '=isnull=';

/**
 * List of all supported RSQL operators.
 */
const qParamSupportedOperators = {
  comparison: ['=like=', '=notlike=', '==', '!=', '=isnull='],
  logical: [',', ';'],
};

const qParamSupportedComparisonOperatorsRegex = new RegExp('(' + qParamSupportedOperators.comparison.join('|') + ')');

/**
 * @example
 * {
 *   name: ['"%t1%"', '"%t2%"'],
 *   status: ['CANCELLED', 'SYSTEM_ERROR']
 * }
 */
export interface IQParamObject {
  [key: string]: string[];
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
    default:
      return `${id}${operator}${value}`;
  }
};

/**
 * @param qParamString - Array of strings (RSQL expressions): ['name=like="%a%"', 'name=notlike="%b%"', 'description=like="%c%"', 'name=like="%d%"']
 * @returns Joined RSQL string. Items within one group (same id (key)) are joined with OR operator, groups are joined with AND operator.
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
      const groupStringified = group.map((item) => `${item.id}${item.operator}${item.value}`).join(',');

      // () because: AND precedence > OR precedence
      return `(${groupStringified})`;
    })
    .join(';');
};

/**
 * @returns
 * 1) new Q string containing new param
 * 2) null when Q param is already contained in Q string
 */
export const addQParamItem = (id: string, value: TQParamValue, operator: IQParamOperators, qParam: string): string | null => {
  const qParamItems = parseQParamShallow(qParam);
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

  // #support =notlike=
  // value already contains "% characters
  // use '=notlike=' when '=like=!' exists, otherwise use '=like='
  const removeItem = (id + operator + value).replace('=like=!', '=notlike=');
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
 * @returns Object representing individual RSQL items deeply parsed:
 * {
 *   name: ['"%te%t%"'],
 *   status: ['CANCELLED']
 * }
 */
export const parseQParamDeep = (qParam: string): IQParamObject => {
  let qParamObject: IQParamObject = {};

  let qParamItems = parseQParamShallow(qParam);

  // loop Q Params Items
  for (let i = 0; i < qParamItems.length; i++) {
    let qParamItemSplitted = qParamItems[i].split(qParamSupportedComparisonOperatorsRegex);

    if (qParamItemSplitted.length >= 3) {
      let [qKey, qOperator, qValue] = [...qParamItemSplitted.splice(0, 2), qParamItemSplitted.join('')];

      // add ! character
      // #support =notlike=
      if (qOperator === '=notlike=') {
        qValue = '!' + qValue;
      }

      if (qParamObject[qKey]) {
        qParamObject[qKey].push(qValue);
      } else {
        qParamObject[qKey] = [qValue];
      }
    } else {
      uiLogger.error(
        `${qParamItems[i]} does not contain any valid operator, supported operators are: ${qParamSupportedOperators.comparison}`
      );
    }
  }
  return qParamObject;
};
