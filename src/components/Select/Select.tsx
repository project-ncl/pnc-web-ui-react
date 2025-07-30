import { MenuToggle, SelectList, Select as SelectPF, SelectProps } from '@patternfly/react-core';
import { ReactNode, useMemo } from 'react';

import { TState } from 'hooks/useForm';

export type TSelectOption = string | Object;

interface ISelectProps<T extends TSelectOption> {
  id?: SelectProps['id'];
  isOpen: SelectProps['isOpen'];
  onToggle: NonNullable<SelectProps['onOpenChange']>;
  value?: T;
  onChange: (event: Parameters<NonNullable<SelectProps['onSelect']>>[0], option: T) => void;
  validated?: TState;
  placeholder?: string;
  onBlur?: SelectProps['onBlur'];
  toggleIcon?: ReactNode;
  isToggleFullWidth?: boolean;
  className?: string;
  children: ReactNode | ReactNode[];
}

/**
 * Select dropdown component.
 *
 * @param isOpen - Select expansion state
 * @param onToggle - Callback to toggle `isOpen` state
 * @param value - Currently selected value (option) of the select
 * @param onChange - Callback setting the `value` (on-select)
 * @param validated - State of validation ({@link TState})
 * @param placeholder - Text displayed when no option is selected
 * @param onBlur - Callback called on blur from the component
 * @param isToggleFullWidth - If true, select toggle takes full width of the parent
 */
export const Select = <T extends TSelectOption>({
  id,
  className,
  isOpen,
  onToggle,
  value,
  onChange,
  validated,
  placeholder,
  onBlur,
  toggleIcon,
  isToggleFullWidth = true,
  children,
}: ISelectProps<T>) => {
  const status = useMemo(() => {
    if (validated === 'error') return 'danger';
    if (validated === 'default') return undefined;

    return validated;
  }, [validated]);

  return (
    <SelectPF
      id={id}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          isFullWidth={isToggleFullWidth}
          status={status}
          isExpanded={isOpen}
          onClick={() => onToggle(!isOpen)}
          icon={toggleIcon}
        >
          {!toggleIcon && (value?.toString() || placeholder)}
        </MenuToggle>
      )}
      isOpen={isOpen}
      onOpenChange={onToggle}
      selected={value}
      onSelect={(event, option) => {
        onChange(event, option as T);
        onToggle(false);
      }}
      onBlur={onBlur}
      className={className}
    >
      <SelectList>{children}</SelectList>
    </SelectPF>
  );
};
