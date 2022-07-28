import { useEffect, useState } from 'react';

interface IFieldValues {
  [key: string]: string;
}

interface IFieldErrors {
  [key: string]: string | undefined;
}

interface IFieldValidators {
  [key: string]: IValidator;
}

interface IValidator {
  isRequired?: boolean;
  validator?: Function;
}

/**
 * Hook to manage input values, validation and states of a form.
 * All validation is done on change of input.
 * Submit button is firstly disabled. In order to enable button:
 *  -> at least one change must be done
 *  -> all required fields must not be empty
 *  -> all validated inputs must be valid
 *
 * See also {@link ProjectCreateEditPage}
 *
 * @param initValues - Values to initialize inputs with
 * @param validators - Objects consisting of whether is input required and validation function
 * @param callback - Function to call when submitting user input data
 *
 * @returns form states and access functions
 *  -> fieldValues - values of input fields
 *  -> fieldErrors - error messages of inout fields
 *  -> fieldStates - 'default' | 'success' | 'error'
 *  -> isSubmitDisabled - submit disabled or not
 *  -> onChange - callback for input fields on change
 *  -> setFieldValues - set all field values
 *  -> onSubmit - callback for submit button
 *
 * initValues, validators, fieldValues, fieldErrors, fieldStates are objects whose keys are equal to ids of inputs fields.
 * example: validators.projectUrl.isRequired
 */
export const useForm = (initValues: IFieldValues, validators: IFieldValidators, callback: Function) => {
  // is submit button disabled?
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  // input values
  const [fieldValues, setFieldValues] = useState<IFieldValues>(initValues);
  // input error messages
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({});
  // inpur validation functions
  const [fieldValidators, setFieldValidators] = useState<IFieldValidators>(validators);

  const initFieldStates = { ...initValues };
  Object.keys(initFieldStates).forEach((key) => {
    initFieldStates[key] = 'default';
  });
  // input states - 'default' | 'success' | 'error'
  const [fieldStates, setFieldStates] = useState<any>(initFieldStates);

  useEffect(() => {
    if (isFormValid() && areRequiredFilled()) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [fieldValues]);

  // are all validated inputs valid?
  const isFormValid = () => {
    return !Object.keys(fieldErrors).length;
  };

  // are all required inputs filled?
  const areRequiredFilled = () => {
    for (const key in fieldValidators) {
      if (fieldValidators[key].isRequired && !fieldValues[key]) {
        return false;
      }
    }

    return true;
  };

  // callback (on change of input)
  const onChange = (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const fieldName = event.currentTarget.name;
    const fieldValue = event.currentTarget.value;
    setFieldValues({ ...fieldValues, [fieldName]: fieldValue });

    validate(fieldName, fieldValue);
  };

  // validate field
  const validate = (fieldName: string, fieldValue: string) => {
    if (fieldValidators[fieldName]) {
      const isRequired = fieldValidators[fieldName].isRequired;
      const validator = fieldValidators[fieldName].validator;
      if (isRequired) {
        const error = fieldValue ? '' : 'Field must be filled!';
        setError(fieldName, fieldValue, error);
      } else if (validator) {
        const error = validator(fieldValue);
        setError(fieldName, fieldValue, error);
      }
    }
  };

  // set error message and state
  const setError = (fieldName: string, fieldValue: string, error: string) => {
    if (error) {
      setFieldErrors({ ...fieldErrors, [fieldName]: error });
      setFieldStates({ ...fieldStates, [fieldName]: 'error' });
    } else {
      // if no error, delete old error (if any)
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
      // display success state only if not empty
      if (fieldValue) {
        setFieldStates({ ...fieldStates, [fieldName]: 'success' });
      } else {
        setFieldStates({ ...fieldStates, [fieldName]: 'default' });
      }
    }
  };

  // callback (on submit of form)
  const onSubmit = () => {
    callback(fieldValues);
    // reset state to 'default' (valid inputs wont be highlighted)
    setFieldStates(initFieldStates);
    setIsSubmitDisabled(true);
  };

  return { fieldValues, fieldErrors, fieldStates, isSubmitDisabled, onChange, setFieldValues, onSubmit };
};
