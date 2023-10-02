import { IRegisterData, TValue } from 'hooks/useForm';

interface IFormInputProps<T extends TValue> extends IRegisterData<T> {
  render: (registerData: IRegisterData<T>) => JSX.Element;
}

/**
 * Form input wrapper component.
 * It's meant to be used with the {@link useForm} hook when the hook's API is not compatible with the component's API.
 * For example, PatternFly's Select component (onSelect) vs useForm hook (onChange).
 *
 * @param value - Value of the input
 * @param onChange - On-change callback of the input
 * @param onBlur - On-blur callback of the input
 * @param validated - Input state
 * @param validationState - State of the input validation
 * @param render - Function to render the form input component
 * @returns
 */
export const FormInput = <T extends TValue>({
  value,
  onChange,
  onBlur,
  validated,
  validationState,
  render,
}: IFormInputProps<T>) => {
  return render({ value, onChange, onBlur, validated, validationState });
};
