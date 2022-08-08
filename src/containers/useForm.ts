import { useCallback, useEffect, useState } from 'react';
import { TextInputProps } from '@patternfly/react-core';

export interface IFieldValues {
  [key: string]: string;
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

export interface IForm {
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
export const useForm = (initForm: Omit<Omit<IForm, 'errorMessage'>, 'state'>, callback: Function) => {
  const defaultForm = { ...initForm };
  for (const key in defaultForm) {
    if (!defaultForm[key].value) defaultForm[key].value = '';
    defaultForm[key].state = 'default';
  }
  const [form, setForm] = useState<IForm>(defaultForm);

  // is submit button disabled?
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  // has any field been changed?
  // important for edit page (do not submit until any new content)
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  // are all validated inputs valid?
  const isFormValid = useCallback(() => {
    for (const key in form) {
      if (form[key].errorMessages?.length) return false;
    }

    return true;
  }, [form]);

  // are all required inputs filled?
  const areRequiredFilled = useCallback(() => {
    for (const key in form) {
      if (form[key].isRequired && !form[key].value) {
        return false;
      }
    }

    return true;
  }, [form]);

  // callback (on change of an input)
  const onChange = (fieldName: any, fieldValue: any) => {
    // also delete old error messages, new checks are going to be done
    const newFieldState = {
      ...form[fieldName],
      value: fieldValue,
      errorMessages: [],
      state: 'default' as TextInputProps['validated'],
    };
    validate(newFieldState);
    setForm({ ...form, [fieldName]: newFieldState });

    setHasChanged(true);
  };

  // validate field state and change error messages / state
  const validate = (fieldState: IField) => {
    if (fieldState.isRequired) {
      const error = fieldState.value ? '' : 'Field must be filled.';
      addError(fieldState, error);
      setState(fieldState);
    }
    if (fieldState.validators) {
      for (const validator of fieldState.validators) {
        const error = validator.validator(fieldState.value) ? '' : validator.errorMessage;
        addError(fieldState, error);
      }
      setState(fieldState);
    }
  };

  // add error message to field state
  const addError = (fieldState: IField, error: string) => {
    if (error) {
      fieldState.errorMessages?.push(error);
    }
  };

  // set state of a field (errors should have been set before)
  const setState = (fieldState: IField) => {
    if (fieldState.errorMessages?.length) {
      fieldState.state = 'error';
    } else {
      // display success state only if not empty
      if (fieldState.value) {
        fieldState.state = 'success';
      } else {
        fieldState.state = 'default';
      }
    }
  };

  // callback (on submit of a form)
  const onSubmit = () => {
    callback().catch((error: any) => {
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
    const formCopy = { ...form };
    for (const key in formCopy) {
      formCopy[key].state = 'default';
    }
    setForm(formCopy);
    setHasChanged(false);
  };

  // set all input field to values (used for edit form)
  const applyValues = useCallback(
    (fieldValues: IFieldValues) => {
      const newForm = { ...form };
      for (const key in fieldValues) {
        newForm[key].value = fieldValues[key];
        newForm[key].state = 'default';
      }

      setForm(newForm);
    },
    [form]
  );

  // on change of a input, check whether submit button should be disabled
  useEffect(() => {
    if (isFormValid() && areRequiredFilled() && hasChanged) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [form, hasChanged, isFormValid, areRequiredFilled]);

  return { form, applyValues, onChange, onSubmit, isSubmitDisabled };
};
