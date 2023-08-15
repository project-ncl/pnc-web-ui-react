import { TextInputProps } from '@patternfly/react-core';
import { useCallback, useEffect, useState } from 'react';

interface IFieldValues {
  [key: string]: string | boolean | undefined;
}

interface IValidator {
  validator: Function;
  errorMessage: string;
}

interface IField {
  value?: string | boolean;
  errorMessages?: string[];
  state?: TextInputProps['validated'];
  isRequired?: boolean;
  validators?: IValidator[];
}

export interface IFields {
  [key: string]: IField;
}

/**
 * Hook to manage input values, validation and states of a form.
 * All validation is done on change of an input.
 * Submit button is firstly disabled. In order to enable button:
 *  -> at least one change must be done (not possible to submit unchanged edit form)
 *  -> all required fields must not be empty
 *  -> all validated inputs must be valid
 *
 * Input strings are trimmed.
 *
 * See also {@link ProjectCreateEditPage} {@link ScmRepositoryCreateEditPage}
 *
 * @param initFields - Init form state (just values and validators)
 * @param submitCallback - Function to call when submitting user input data
 *
 * initFields has to specify all inputs (keys to IFields) - even if just empty objects.
 *
 * @returns form states and access functions
 *  -> fields           - whole form state
 *  -> reinitialize     - set all field values
 *  -> onChange         - callback for input fields on change
 *  -> onSubmit         - callback for submit button
 *  -> isSubmitDisabled - is submit button disabled?
 *  -> hasChanged       - has the form been touched?
 *
 * initFields and fields objects hold whole state of a form.
 * their structure:
 *  -> [key]:   -- input field ID
 *    -> value  -- field value
 *    -> errorMessages -- actual error messages (in case of an error)
 *    -> state  -- state of a field ('default', 'success', 'error') (check out: https://www.patternfly.org/v4/components/text-input/)
 *    -> isRequired   -- is field required?
 *    -> validators:  -- validation functions and their error messages
 *      -> validator    -- validation function
 *      -> errorMessage -- error message that should be set in a case of an error
 */
export const useForm = (initFields: Omit<Omit<IFields, 'errorMessages'>, 'state'>, submitCallback: Function) => {
  // transform init data (add default data + possibly apply new values)
  const transformFormData = useCallback(
    (values?: IFieldValues): IFields => {
      const defaultFields: IFields = {};
      for (const key in initFields) {
        defaultFields[key] = {};

        // init data
        defaultFields[key].isRequired = initFields[key].isRequired;
        // SHALLOW COPY (should not change anyway)
        defaultFields[key].validators = initFields[key].validators;

        // additional data
        defaultFields[key].state = 'default';
        if (values?.[key]) {
          defaultFields[key].value = values[key];
        } else if (initFields[key].value) {
          defaultFields[key].value = initFields[key].value;
        } else {
          defaultFields[key].value = '';
        }
      }
      return defaultFields;
    },
    [initFields]
  );

  const [fields, setFields] = useState<IFields>(transformFormData());

  // is submit button disabled?
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  // has any field been changed?
  // important for edit page (do not submit until any new content)
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  // callback (on change of an input)
  const onChange = (fieldName: string, fieldValue: any) => {
    // also delete old error messages, new checks are going to be done
    const newField = {
      ...fields[fieldName],
      value: typeof fieldValue === 'boolean' || fieldValue ? fieldValue : '',
      errorMessages: [],
      state: 'default' as TextInputProps['validated'],
    };
    validate(newField);
    setFields({ ...fields, [fieldName]: newField });

    setHasChanged(true);
  };

  // validate field state and change error messages / state
  const validate = (field: IField) => {
    if (field.isRequired) {
      if (typeof field.value === 'string' && !field.value?.trim()) {
        addError(field, 'Field must be filled.');
      }
      setState(field);
    }
    if (field.validators) {
      for (const validator of field.validators) {
        if (!validator.validator(field.value)) {
          addError(field, validator.errorMessage);
        }
      }
      setState(field);
    }
  };

  // add error message to field state
  const addError = (field: IField, error: string) => {
    if (error) {
      field.errorMessages?.push(error);
    }
  };

  // set state of a field (errors should have been set before)
  const setState = (field: IField) => {
    if (field.errorMessages?.length) {
      field.state = 'error';
    } else {
      // display success state only if not empty
      if (field.value) {
        field.state = 'success';
      } else {
        field.state = 'default';
      }
    }
  };

  // callback (on submit of a form)
  const onSubmit = () => {
    const fieldsCopy = { ...fields };
    for (const key in fieldsCopy) {
      // trim just strings
      fieldsCopy[key].value =
        typeof fieldsCopy[key].value === 'string' ? (fieldsCopy[key].value as string)?.trim() : fieldsCopy[key].value;
      // reset state to 'default' (valid inputs wont be highlighted)
      fieldsCopy[key].state = 'default';
    }

    submitCallback(fieldsCopy);

    // submitCallback(fieldsCopy).catch((error: Error) => {
    //   // error is displayed by the ServiceContainer
    //   console.error(error);
    // });
    // .catch((error: any) => {
    // FUTURE IMPLEMENTATION (backend error):
    // const fieldsCopy = { ...fields };
    // for (const key in error.details.validation) {
    //   const newField = { ...fields[key], error: error.details.validation[key].errorMessage, state: 'error' };
    //   fieldsCopy[key] = newField;
    // }
    // setFields(fieldsCopy);
    // });

    setFields(fieldsCopy);
    setHasChanged(false);
  };

  // set all input fields to values (used for edit form)
  const reinitialize = useCallback(
    (fieldValues: IFieldValues) => {
      setFields(transformFormData(fieldValues));
    },
    [transformFormData]
  );

  // on change of an input, check whether submit button should be disabled
  useEffect(() => {
    // are all validated inputs valid?
    const isFormValid = () => {
      for (const key in fields) {
        if (fields[key].errorMessages?.length) return false;
      }

      return true;
    };

    // are all required inputs filled?
    const areRequiredFilled = () => {
      for (const key in fields) {
        if (fields[key].isRequired && typeof fields[key].value === 'string' && !(fields[key].value as string)?.trim()) {
          return false;
        }
      }

      return true;
    };

    if (isFormValid() && areRequiredFilled() && hasChanged) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [fields, hasChanged]);

  return { fields, reinitialize, onChange, onSubmit, isSubmitDisabled, hasChanged };
};
