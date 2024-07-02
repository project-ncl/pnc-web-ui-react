import { SelectOption as SelectOptionPF, SelectOptionProps } from '@patternfly/react-core';

import { TSelectOption } from 'components/Select/Select';

interface ISelectOptionProps<T extends TSelectOption> {
  option: T;
  title?: SelectOptionProps['children'];
  description?: SelectOptionProps['description'];
  isDisabled?: SelectOptionProps['isDisabled'];
}

/**
 * Select option item component. To be used directly as children of {@link Select}.
 *
 * @param option - Value of the select option provided in the onChange callback of the {@link Select}
 * @param title - String displayed as title of the select option. IF undefined, stringified `option` is shown
 * @param description - Description under the `title`
 */
export const SelectOption = <T extends TSelectOption>({ option, title, ...restProps }: ISelectOptionProps<T>) => (
  <SelectOptionPF value={option} {...restProps}>
    {title || option.toString()}
  </SelectOptionPF>
);
