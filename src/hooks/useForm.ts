import { TextInputProps } from '@patternfly/react-core';
import { useCallback, useState } from 'react';

import { transformFormToValues } from 'utils/patchHelper';

type TState = TextInputProps['validated'];

interface IValidator {
  validator: Function;
  errorMessage: string;
}

interface IField<T> {
  value?: T;
  errorMessages?: string[];
  state?: TState;
  isRequired?: boolean;
  validators?: IValidator[];
}

export type TFieldConfig<T> = Omit<IField<T>, 'errorMessages' | 'state'>;

export interface IFields {
  [fieldName: string]: IField<any>;
}

type OnChangeFunction<T> = (value: T) => void;

type OnBlurFunction = () => void;

export interface IRegisterData<T> {
  value: T;
  onChange: OnChangeFunction<T>;
  onBlur: OnBlurFunction;
  validated: TState;
}

type OnSubmitCallback = (data: IFieldValues) => void;

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

  const register = <T>(fieldName: string, fieldConfig?: TFieldConfig<T>): IRegisterData<T> => {
    if (!fields[fieldName]) {
      setFields((fields) => ({ ...fields, [fieldName]: { ...fieldConfig, value: fieldConfig?.value || '', state: 'default' } }));
    }

    return {
      value: fields[fieldName]?.value,
      onChange: handleChange<T>(fieldName),
      onBlur: handleBlur<T>(fieldName),
      validated: fields[fieldName]?.state,
    };
  };

  const handleChange = <T>(fieldName: string): OnChangeFunction<T> => {
    return (value: T) => {
      setFields((fields) => {
        const newFields = { ...fields, [fieldName]: constructNewFieldOnChange<T>(fields[fieldName], value) };

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
            const value =
              typeof newFields[fieldName].value === 'string' ? newFields[fieldName].value?.trim() : newFields[fieldName].value;
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

  const handleBlur = <T>(fieldName: string): OnBlurFunction => {
    return () => {
      setFields((fields) => ({
        ...fields,
        [fieldName]: constructNewFieldOnBlur<T>(fields[fieldName], fields[fieldName].value),
      }));
    };
  };

  const constructNewFieldOnChange = <T>(field: IField<T>, value: T): IField<T> => {
    // field == React state, do not mutate nested objects and arrays directly
    const newField: IField<T> = { ...field };

    newField.value = constructNewFieldValue<T>(value);
    newField.errorMessages = consructNewFieldErrorMessages<T>(field, newField.value);
    newField.state = constructNewFieldState<T>(newField.value, newField.errorMessages);

    return newField;
  };

  const constructNewFieldOnBlur = <T>(field: IField<T>, value: T): IField<T> => {
    // field == React state, do not mutate nested objects and arrays directly
    const newField: IField<T> = { ...field };

    newField.value = typeof value === 'string' ? (value?.trim() as T) : value;

    return newField;
  };

  const constructNewFieldValue = <T>(value: T): T => {
    if (typeof value === 'string') {
      return (value ? value : '') as T;
    }

    return value;
  };

  const consructNewFieldErrorMessages = <T>(field: IField<T>, value: T): string[] => {
    const errorMessages = [];

    if (field.isRequired) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        errorMessages.push('Field must be filled.');
      }
    }

    if (field.validators?.length) {
      for (const validator of field.validators) {
        if (!validator.validator(value)) {
          errorMessages.push(validator.errorMessage);
        }
      }
    }

    return errorMessages;
  };

  const constructNewFieldState = <T>(value: T, errorMessages?: string[]): TState => {
    if (errorMessages?.length) {
      return 'error';
    } else {
      if (value) {
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

      onSubmit(transformFormToValues(fields));

      setFields(fieldsCopy);
      setHasFormChanged(false);
      setIsSubmitDisabled(true);
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
