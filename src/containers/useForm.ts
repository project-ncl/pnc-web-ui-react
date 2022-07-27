import { useEffect, useState } from 'react';

interface IFieldValues {
  [key: string]: string;
}

interface IFieldErros {
  [key: string]: string | undefined;
}

interface IFieldValidators {
  [key: string]: Function;
}

export const useForm = (initValues: IFieldValues, validators: IFieldValidators, callback: Function) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const [fieldValues, setFieldValues] = useState<IFieldValues>(initValues);
  const [fieldErrors, setFieldErrors] = useState<IFieldErros>({});
  const [fieldValidators, setFieldValidators] = useState<IFieldValidators>(validators);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initFieldStates = { ...initValues };
  Object.keys(initFieldStates).forEach((key) => {
    initFieldStates[key] = 'default';
  });
  const [fieldStates, setFieldStates] = useState<any>(initFieldStates);

  useEffect(() => {
    if (!Object.keys(fieldErrors).length && hasChanged) {
      setIsFormValid(true);
      if (isSubmitting) {
        callback(fieldValues);
        setFieldStates(initFieldStates);
      }
    } else {
      setIsFormValid(false);
    }

    setIsSubmitting(false);
  }, [fieldErrors]);

  const onChange = (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const fieldName = event.currentTarget.name;
    setFieldValues({ ...fieldValues, [fieldName]: event.currentTarget.value });
    setHasChanged(true);

    if (fieldValidators[fieldName]) {
      const error = fieldValidators[fieldName](event.currentTarget.value);
      setError(fieldName, error);
    }
  };

  const setError = (fieldName: string, error: string) => {
    if (error) {
      setFieldErrors({ ...fieldErrors, [fieldName]: error });
      setFieldStates({ ...fieldStates, [fieldName]: 'error' });
    } else {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
      setFieldStates({ ...fieldStates, [fieldName]: 'success' });
    }
  };

  const onSubmit = () => {
    for (const key in fieldValidators) {
      const error = fieldValidators[key](fieldValues[key]);

      if (error) {
        setFieldErrors({ ...fieldErrors, [key]: error });
      } else {
        const newErrors = { ...fieldErrors };
        delete newErrors[key];
        setFieldErrors(newErrors);
      }
    }

    setIsSubmitting(true);
  };

  return { fieldValues, fieldErrors, fieldStates, isFormValid, onChange, setFieldValues, onSubmit };
};
