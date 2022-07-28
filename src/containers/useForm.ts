import { useEffect, useState } from 'react';

interface IFieldValues {
  [key: string]: string;
}

interface IFieldErrors {
  [key: string]: string | undefined;
}

interface IFieldValidators {
  [key: string]: Function;
}

/**
 * Hook to manage input values, validation and states of a form. All validation is done on change of input.
 * See also {@link ProjectCreateEditPage}
 *
 * @param initValues - Values to initialize inputs with
 * @param validators - Functions to validate inputs with
 * @param callback - Function to call when submitting user input data
 *
 * Both initValues and validators are objects whose keys are equal to ids of input elements.
 */
export const useForm = (initValues: IFieldValues, validators: IFieldValidators, callback: Function) => {
  // are all form inputs valid?
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // has user made any changes to the newly loaded form?
  // at least one change must be to in order to submit form
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  // input values
  const [fieldValues, setFieldValues] = useState<IFieldValues>(initValues);
  // input error messages
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({});
  // inpur validation functons
  const [fieldValidators, setFieldValidators] = useState<IFieldValidators>(validators);

  // submitting state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initFieldStates = { ...initValues };
  Object.keys(initFieldStates).forEach((key) => {
    initFieldStates[key] = 'default';
  });
  // input states - 'default' | 'success' | 'error'
  const [fieldStates, setFieldStates] = useState<any>(initFieldStates);

  useEffect(() => {
    if (!Object.keys(fieldErrors).length && hasChanged) {
      setIsFormValid(true);
      if (isSubmitting) {
        callback(fieldValues);
        // reset state to 'default' (valid inputs wont be highlighted)
        setFieldStates(initFieldStates);
      }
    } else {
      setIsFormValid(false);
    }

    setIsSubmitting(false);
  }, [fieldErrors, hasChanged]);

  const onChange = (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const fieldName = event.currentTarget.name;
    const fieldValue = event.currentTarget.value;
    setFieldValues({ ...fieldValues, [fieldName]: fieldValue });
    setHasChanged(true);

    // if has any validator
    if (fieldValidators[fieldName]) {
      const error = fieldValidators[fieldName](fieldValue);
      setError(fieldName, fieldValue, error);
    }
  };

  const setError = (fieldName: string, fieldValue: string, error: string) => {
    if (error) {
      setFieldErrors({ ...fieldErrors, [fieldName]: error });
      setFieldStates({ ...fieldStates, [fieldName]: 'error' });
    } else {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
      if (fieldValue) {
        setFieldStates({ ...fieldStates, [fieldName]: 'success' });
      } else {
        setFieldStates({ ...fieldStates, [fieldName]: 'default' });
      }
    }
  };

  const onSubmit = () => {
    let errors: IFieldErrors = {};

    // check all validated inputs before submit
    for (const key in fieldValidators) {
      const error = fieldValidators[key](fieldValues[key]);
      if (error) errors[key] = error;
    }

    setFieldErrors(errors);
    const fieldStates = { ...errors };
    Object.keys(fieldStates).forEach((key) => {
      fieldStates[key] = 'error';
    });
    setFieldStates(fieldStates);

    setIsSubmitting(true);
  };

  return { fieldValues, fieldErrors, fieldStates, isFormValid, onChange, setFieldValues, onSubmit };
};
