import { Select, SelectProps } from '@patternfly/react-core/deprecated';

import { IRegisterData } from 'hooks/useForm';

interface ICreatableSelectProps {
  onSelect: SelectProps['onSelect'];
  onClear?: SelectProps['onClear'];
  onCreateOption: SelectProps['onCreateOption'];
  onToggle: SelectProps['onToggle'];
  selectedItem?: SelectProps['selections'];
  validated?: IRegisterData<any>['validated'];
  isOpen: SelectProps['isOpen'];
  placeholderText?: SelectProps['placeholderText'];
  creatableOptionText?: SelectProps['createText'];
  isDisabled?: SelectProps['isDisabled'];
  width?: SelectProps['width'];
  dropdownDirection?: SelectProps['direction'];
  isInputValuePersisted?: SelectProps['isInputValuePersisted'];
  isInputFilterPersisted?: SelectProps['isInputFilterPersisted'];
  children: SelectProps['children'];
}

/**
 * Select component with filtrable and creatable options functionality.
 *
 * @param onSelect - On option select callback
 * @param onClear - On option clear callback
 * @param onCreateOption - On create new option callback
 * @param onToggle - On select dropdown toggle callback
 * @param selectedItem - Selected item string
 * @param validated - Select input validation state
 * @param isOpen - Whether the select dropdown is open
 * @param placeholderText - Select placeholder text
 * @param creatableOptionText - Text of the creatable option
 * @param isDisabled - Whether the select is disabled
 * @param width - Width of the select
 * @param dropdownDirection - In which direction the select dropdown is displayed
 * @param isInputValuePersisted - Whether filter text retains on-blur
 * @param isInputFilterPersisted - Whether options remain filtered on-blur
 * @param children - Select options
 */
export const CreatableSelect = ({
  onSelect,
  onClear,
  onCreateOption,
  onToggle,
  selectedItem,
  validated,
  isOpen,
  placeholderText,
  creatableOptionText,
  isDisabled,
  width,
  dropdownDirection,
  isInputValuePersisted = true,
  isInputFilterPersisted = true,
  children,
}: ICreatableSelectProps) => (
  <Select
    variant="typeahead"
    onSelect={onSelect}
    onClear={onClear}
    onCreateOption={onCreateOption}
    onToggle={onToggle}
    selections={selectedItem}
    isOpen={isOpen}
    validated={validated}
    placeholderText={placeholderText}
    createText={creatableOptionText}
    isDisabled={isDisabled}
    width={width}
    direction={dropdownDirection}
    isCreatable
    isCreateOptionOnTop
    isInputValuePersisted={isInputValuePersisted}
    isInputFilterPersisted={isInputFilterPersisted}
  >
    {children}
  </Select>
);
