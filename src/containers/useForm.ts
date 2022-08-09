import { useCallback, useEffect, useState } from 'react';
import { TextInputProps } from '@patternfly/react-core';

interface IFieldValues {
  [key: string]: string | undefined;
}

interface IValidator {
  validator: Function;
  errorMessage: string;
}

interface IField {
  value?: string;
  errorMessages?: string[];
  state?: TextInputProps['validated'];
  isRequired?: boolean;
  validators?: IValidator[];
}

interface IFields {
  [key: string]: IField;
}

/**
 * Hook to manage input values, validation and states of a form.
 * All validation is done on change of input.
 * Submit button is firstly disabled. In order to enable button:
 *  -> at least one change must be done (not possible to submit unchanged edit form)
 *  -> all required fields must not be empty
 *  -> all validated inputs must be valid
 *
 * See also {@link ProjectCreateEditPage}
 *
 * @param initForm - Init form state (just values and validators)
 * @param callback - Function to call when submitting user input data
 *
 * initForm has to specify all inputs (keys to IFormState) - even if just empty objects.
 *
 * @returns form states and access functions
 *  -> form             - whole form state
 *  -> applyValues      - set all field values
 *  -> onChange         - callback for input fields on change
 *  -> onSubmit         - callback for submit button
 *  -> isSubmitDisabled - is submit button disabled?
 *
 * initForm and form objects hold whole state of a form.
 * their structure:
 *  -> [key]:   -- input field ID
 *    -> value  -- field value
 *    -> errorMessage -- actual error messages (in case of an error)
 *    -> state  -- state of a field ('default', 'success', 'error')
 *    -> validation:    -- means of validation
 *      -> isRequired   -- is field required?
 *      -> validators:  -- validation functions and their error messages
 *        -> validator    -- validation function
 *        -> errorMessage -- error message that should be set in a case of an error
 */
export const useForm = (initFields: Omit<Omit<IFields, 'errorMessages'>, 'state'>, submitCallback: Function) => {
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

  // are all validated inputs valid?
  const isFormValid = useCallback(() => {
    for (const key in fields) {
      if (fields[key].errorMessages?.length) return false;
    }

    return true;
  }, [fields]);

  // are all required inputs filled?
  const areRequiredFilled = useCallback(() => {
    for (const key in fields) {
      if (fields[key].isRequired && !fields[key].value) {
        return false;
      }
    }

    return true;
  }, [fields]);

  // callback (on change of an input)
  const onChange = (fieldName: string, fieldValue: any) => {
    // also delete old error messages, new checks are going to be done

    const newField = {
      ...fields[fieldName],
      value: fieldValue ? fieldValue : '',
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
      const error = field.value ? '' : 'Field must be filled.';
      addError(field, error);
      setState(field);
    }
    if (field.validators) {
      for (const validator of field.validators) {
        const error = validator.validator(field.value) ? '' : validator.errorMessage;
        addError(field, error);
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
    submitCallback().catch((error: any) => {
      // backend error, just log it at the moment
      console.error(error);

      // FUTURE IMPLEMENTATION:
      // const formCopy = { ...form };
      // for (const key in error.details.validation) {
      //   const newField = { ...form[key], error: error.details.validation[key].errorMessage, state: 'error' };
      //   formCopy[key] = newField;
      // }
      // setForm(formCopy);
    });

    // reset state to 'default' (valid inputs wont be highlighted)
    const formCopy = { ...fields };
    for (const key in formCopy) {
      formCopy[key].state = 'default';
    }
    setFields(formCopy);
    setHasChanged(false);
  };

  // set all input field to values (used for edit form)
  const reinitialize = useCallback(
    (fieldValues: IFieldValues) => {
      setFields(transformFormData(fieldValues));
    },
    [transformFormData]
  );

  // on change of a input, check whether submit button should be disabled
  useEffect(() => {
    if (isFormValid() && areRequiredFilled() && hasChanged) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [fields, hasChanged, isFormValid, areRequiredFilled]);

  return { fields, reinitialize, onChange, onSubmit, isSubmitDisabled };
};
