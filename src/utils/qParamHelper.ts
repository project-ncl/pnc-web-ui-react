/**
 * Q (RSQL) param helper
 *
 * Only ';' is supported at this moment
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
import { uiLogger } from 'utils/uiLogger';

/**
 * Operator =like= is converted to =notlike= automatically when qValue starts with ! character,
 * there is no need to declare it manually.
 */
export type IQParamOperators = '=like=' | '==' | '!=';

/**
 * List of all supported RSQL operators.
 */
const qParamSupportedOperators = ['=like=', '=notlike=', '==', '!='];

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
 * @param qParamString RSQL string: filename=like="%te%t%";status!=CANCELLED
 * @returns Array of individual RSQL items: [filename=like="%te%t%", status!=CANCELLED]
 */
const parseQParamShallow = (qParamString: string): string[] => {
  let qParamArray: string[];
  if (qParamString.indexOf(';') > -1) {
    qParamArray = qParamString.split(';');
  } else if (qParamString) {
    qParamArray = [qParamString];
  } else {
    qParamArray = [];
  }
  return qParamArray;
};

const constructQParamItem = (id: string, value: string, operator: IQParamOperators): string => {
  switch (operator) {
    case '=like=':
      // #support =notlike=
      // value does NOT contain "% characters yet, they need to be added
      // use '=notlike=' when '=like="%!' exists, otherwise use '=like='
      return (id + operator + '"%' + value + '%"').replace('=like="%!', '=notlike="%');
    default:
      return `${id}${operator}${value}`;
  }
};

/**
 * @returns
 * 1) new Q string containing new param
 * 2) null when Q param is already contained in Q string
 */
export const addQParamItem = (id: string, value: string, operator: IQParamOperators, qParam: string): string | null => {
  const qParamItems = parseQParamShallow(qParam);
  const newItem = constructQParamItem(id, value, operator);

  // prevent duplicities
  if (qParamItems.indexOf(newItem) === -1) {
    qParamItems.push(newItem);
  } else {
    return null;
  }

  return qParamItems.join(';');
};

/**
 * @param qParam - RSQL string: filename=like="%te%t%";status!=CANCELLED
 * @returns
 * 1) New Q string without specified param
 * 2) Empty string when last param was removed
 */
export const removeQParamItem = (id: string, value: string, operator: IQParamOperators, qParam: string): string => {
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

  return qParamItems.join(';');
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
    let isOperatorFound = false;

    // loop supported operators
    for (let j = 0; j < qParamSupportedOperators.length; j++) {
      const qOperator = qParamSupportedOperators[j];

      if (qParamItems[i].indexOf(qOperator) > -1) {
        isOperatorFound = true;
        let [qKey, qValue] = qParamItems[i].split(qOperator);

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
      }
    }
    if (!isOperatorFound) {
      uiLogger.error(
        `${qParamItems[i]} does not contain any valid operator, supported operators are: ${qParamSupportedOperators}`
      );
    }
  }
  return qParamObject;
};
