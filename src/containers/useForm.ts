import { useCallback, useEffect, useState } from 'react';

export interface IFieldValues {
  [key: string]: string;
}

interface IValidator {
  isRequired?: boolean;
  check?: Function;
}

interface IFieldState {
  value: string;
  errorMessage?: string;
  state?: any;
  validator?: IValidator;
}

export interface IFormState {
  [key: string]: IFieldState;
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
 * @returns form states and access functions
 *  -> form             - whole form state
 *  -> applyValues      - set all field values
 *  -> onChange         - callback for input fields on change
 *  -> onSubmit         - callback for submit button
 *  -> isSubmitDisabled - submit disabled or not
 *
 * initForm and form objects hold whole state of a form.
 * their structure:
 *  -> [key]:   -- input field ID
 *    -> value  -- field value
 *    -> errorMessage -- error message (in case of a error)
 *    -> state  -- state of a field ('default', 'success', 'error')
 *    -> validator:   -- means of validation
 *      -> isRequired -- is field required?
 *      -> check      -- function to check format of an input
 */
export const useForm = (initForm: Omit<Omit<IFormState, 'errorMessage'>, 'state'>, callback: Function) => {
  const defaultForm = { ...initForm };
  for (const key in defaultForm) {
    defaultForm[key].state = 'default';
  }
  const [form, setForm] = useState<IFormState>(defaultForm);

  // is submit button disabled?
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  // has any field been changed?
  // important for edit page (do not submit until any new content)
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  // are all validated inputs valid?
  const isFormValid = useCallback(() => {
    for (const key in form) {
      if (form[key].errorMessage) return false;
    }

    return true;
  }, [form]);

  // are all required inputs filled?
  const areRequiredFilled = useCallback(() => {
    for (const key in form) {
      const validator = form[key].validator;
      if (validator) {
        if (validator.isRequired && !form[key].value) {
          return false;
        }
      }
    }

    return true;
  }, [form]);

  // callback (on change of input)
  const onChange = (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const fieldName = event.currentTarget.name;
    const fieldValue = event.currentTarget.value;

    const newFieldState = { ...form[fieldName], value: fieldValue };
    const validatedFieldState = validate(newFieldState);
    setForm({ ...form, [fieldName]: validatedFieldState });

    setHasChanged(true);
  };

  // validate field state and return new with errors / new state
  const validate = (fieldState: IFieldState): IFieldState => {
    const validator = fieldState.validator;
    if (validator) {
      if (validator.isRequired) {
        const error = fieldState.value ? '' : 'Field must be filled!';
        return setError(fieldState, error);
      } else if (validator.check) {
        const error = validator.check(fieldState.value);
        return setError(fieldState, error);
      }
    }

    return { ...fieldState };
  };

  // create new field state and apply errors / state and return it
  const setError = (fieldState: IFieldState, error: string): IFieldState => {
    if (error) {
      return { ...fieldState, errorMessage: error, state: 'error' };
    } else {
      // display success state only if not empty
      if (fieldState.value) {
        return { ...fieldState, errorMessage: error, state: 'success' };
      } else {
        return { ...fieldState, errorMessage: error, state: 'default' };
      }
    }
  };

  // callback (on submit of form)
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
    setIsSubmitDisabled(true);
  };

  // set all input field to values (used for edit form)
  const applyValues = useCallback(
    (fieldValues: IFieldValues) => {
      const newForm = { ...form };
      for (const key in fieldValues) {
        newForm[key].value = fieldValues[key];
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
