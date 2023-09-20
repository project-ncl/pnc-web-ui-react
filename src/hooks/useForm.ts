import { TextInputProps } from '@patternfly/react-core';
import { AxiosError, isAxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { PncError, isPncError } from 'common/PncError';

import { uiLogger } from 'services/uiLogger';

import { transformFormToValues } from 'utils/patchHelper';

export type TValue = string | number | boolean;

type TState = TextInputProps['validated'];

interface IValidator {
  validator: (value: any) => boolean;
  errorMessage: string;
  relatedFields?: string[];
}

interface IField<T extends TValue> {
  value?: T;
  errorMessages?: string[];
  state?: TState;
  isRequired?: boolean;
  validators?: IValidator[];
}

export type TFieldConfig<T extends TValue> = Omit<IField<T>, 'errorMessages' | 'state'>;

export interface IFields {
  [fieldName: string]: IField<TValue>;
}

export interface IFieldConfigs {
  [fieldName: string]: TFieldConfig<TValue>;
}

type OnChangeFunction<T extends TValue> = (value: T) => void;

type OnBlurFunction = () => void;

export interface IRegisterData<T extends TValue> {
  value: T;
  onChange: OnChangeFunction<T>;
  onBlur: OnBlurFunction;
  validated: TState;
}

type OnSubmitCallback = (data: IFieldValues) => Promise<any>;

type OnSubmitFunction = () => void;

export interface IFieldValues {
  [fieldName: string]: any;
}

/**
 * Hook to manage values, validation and states of form inputs.
 * Validation of an input is run on change of its value. Then adequate state and error messages are set.
 * Submit button is meant to be initially disabled. In order to enable it:
 *  - value of at least one form input must be changed
 *  - all required fields must not be empty
 *  - all validated inputs must be valid
 *
 * Input strings are trimmed before they are passed to the submit callback.
 *
 * For multi-field validations (validating relationships between multiple fields), use validator with relatedFields property defined.
 * relatedFields specifies IDs of other fields that are in multi-field validation group.
 *
 * See related components: {@link FormInput}
 *
 * See example usages: {@link ProjectCreateEditPage} {@link ScmRepositoryCreateEditPage}
 *
 * @returns object containing:
 *  - register         - function registering an input and returning its value, state and on-change function
 *                     - typically used with PatternFly components, otherwise {@link FormInput} can be used for translation of properties
 *  - setFieldValues   - function to set all field values
 *  - getFieldValue    - function to retrieve value of an input
 *  - getFieldState    - function to retrieve state of an input
 *  - getFieldErrors   - function to retrieve (joined) error messages of an input
 *  - handleSubmit     - function returning on-submit function
 *  - isSubmitDisabled - whether the submit button is disabled
 *  - hasFormChanged   - whether any of the form inputs has changed
 */
export const useForm = () => {
  const [fields, setFields] = useState<IFields>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false);

  const register = <T extends TValue>(fieldName: string, fieldConfig?: TFieldConfig<T>): IRegisterData<T> => {
    if (!fields[fieldName]) {
      setFields((fields) => ({ ...fields, [fieldName]: { ...fieldConfig, value: fieldConfig?.value || '', state: 'default' } }));
    }

    return {
      value: fields[fieldName]?.value as T,
      onChange: handleChange<T>(fieldName),
      onBlur: handleBlur<T>(fieldName),
      validated: fields[fieldName]?.state,
    };
  };

  const handleChange = <T extends TValue>(fieldName: string): OnChangeFunction<T> => {
    return (value: T) => {
      setFields((fields) => {
        const newFields = { ...fields };
        newFields[fieldName] = constructNewFieldOnChange<T>(fieldName, newFields, value);

        // to prevent multiple updates when one field is contained in multiple relatedFields
        const updatedFields: string[] = [];

        newFields[fieldName].validators
          ?.filter((validator) => validator.relatedFields?.length)
          ?.forEach((multiFieldValidator) => {
            multiFieldValidator.relatedFields!.forEach((relatedField) => {
              if (!updatedFields.includes(relatedField)) {
                updatedFields.push(relatedField);
                newFields[relatedField] = constructNewFieldOnChange<T>(relatedField, newFields);
              }
            });
          });

        const isFormValid = () => {
          for (const fieldName in newFields) {
            if (newFields[fieldName].errorMessages?.length) {
              return false;
            }
          }

          return true;
        };

        const areRequiredFilled = () => {
          for (const fieldName in newFields) {
            const oldValue = newFields[fieldName].value;
            const value = typeof oldValue === 'string' ? oldValue?.trim() : oldValue;
            if (newFields[fieldName].isRequired && !value) {
              return false;
            }
          }

          return true;
        };

        setIsSubmitDisabled(!isFormValid() || !areRequiredFilled());

        return newFields;
      });

      setHasFormChanged(true);
    };
  };

  const handleBlur = <T extends TValue>(fieldName: string): OnBlurFunction => {
    return () => {
      setFields((fields) => {
        const newFields = { ...fields };

        fields[fieldName] = constructNewFieldOnBlur<T>(fieldName, newFields);

        return newFields;
      });
    };
  };

  const constructNewFieldOnChange = <T extends TValue>(fieldName: string, fields: IFields, newValue?: T): IField<T> => {
    const newField = { ...(fields[fieldName] as IField<T>) };

    if (newValue !== undefined) {
      newField.value = constructNewFieldValue<T>(newValue);
    }
    newField.errorMessages = constructNewFieldErrorMessages(fieldName, { ...fields, [fieldName]: newField });
    newField.state = constructNewFieldState(fieldName, { ...fields, [fieldName]: newField });

    return newField;
  };

  const constructNewFieldOnBlur = <T extends TValue>(fieldName: string, fields: IFields): IField<T> => {
    const newField = { ...(fields[fieldName] as IField<T>) };

    newField.value = typeof newField.value === 'string' ? (newField.value?.trim() as T) : newField.value;

    return newField;
  };

  const constructNewFieldValue = <T extends TValue>(newValue: T): T => {
    if (typeof newValue === 'string') {
      return (newValue ? newValue : '') as T;
    }

    return newValue;
  };

  const constructNewFieldErrorMessages = (fieldName: string, fields: IFields): string[] => {
    const value = fields[fieldName].value;
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    const newErrorMessages = [];

    if (fields[fieldName].isRequired) {
      if (!trimmedValue) {
        newErrorMessages.push('Field must be filled.');
      }
    }

    if (fields[fieldName].validators?.length) {
      for (const validator of fields[fieldName].validators!) {
        const data = validator.relatedFields?.length ? transformFormToValues(fields) : trimmedValue;

        if (!validator.validator(data)) {
          newErrorMessages.push(validator.errorMessage);
        }
      }
    }

    return newErrorMessages;
  };

  const constructNewFieldState = (fieldName: string, fields: IFields): TState => {
    if (fields[fieldName]?.errorMessages?.length) {
      return 'error';
    } else {
      if (fields[fieldName].value) {
        return 'success';
      } else {
        return 'default';
      }
    }
  };

  const setFieldValues = useCallback((fieldValues: IFieldValues) => {
    setFields((fields) =>
      Object.fromEntries(
        Object.entries(fields).map(([fieldName, field]) => [fieldName, { ...field, value: fieldValues[fieldName] || '' }])
      )
    );
  }, []);

  const getFieldValue = (fieldName: string): any => {
    return fields[fieldName]?.value;
  };

  const getFieldState = (fieldName: string): TState => {
    return fields[fieldName]?.state;
  };

  const getFieldErrors = (fieldName: string): string => {
    return fields[fieldName]?.errorMessages?.join(' ') || '';
  };

  const handleSubmit = (onSubmit: OnSubmitCallback): OnSubmitFunction => {
    return () => {
      const fieldsCopy = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, { ...v }]));
      for (const fieldName in fieldsCopy) {
        fieldsCopy[fieldName].state = 'default';
      }

      setFields(fieldsCopy);
      setHasFormChanged(false);
      setIsSubmitDisabled(true);

      onSubmit(transformFormToValues(fields)).catch((error: AxiosError | PncError) => {
        if (isAxiosError(error)) {
          if (error.code === AxiosError.ERR_NETWORK) {
            setIsSubmitDisabled(false);
          }
        } else if (isPncError(error)) {
          if (error.code === 'NEW_ENTITY_ID_ERROR') {
            uiLogger.error(error.message);
          }
        } else {
          uiLogger.error(error.message);
        }
      });
    };
  };

  return {
    register,
    setFieldValues,
    getFieldValue,
    getFieldState,
    getFieldErrors,
    handleSubmit,
    isSubmitDisabled,
    hasFormChanged,
  };
};
