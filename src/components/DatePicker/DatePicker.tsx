import { DatePicker as DatePickerPF } from '@patternfly/react-core';

import { createDateTime } from 'utils/utils';

interface IDatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (date: string) => void;
  onBlur: () => void;
  invalidFormatText?: string;
}

/**
 * Date picker component.
 *
 * @param id - ID of the date field
 * @param name - Name of the date field
 * @param value - Selected date
 * @param onChange - On-change event function
 * @param onBlur - On-blur event function
 * @param invalidFormatText - Text displayed when the date has invalid format
 */
export const DatePicker = ({ id, name, value, onChange, onBlur, invalidFormatText = '' }: IDatePickerProps) => (
  <DatePickerPF
    id={id}
    name={name}
    value={value}
    onChange={(_, date) => {
      onChange(date);
    }}
    onBlur={onBlur}
    dateFormat={(date: Date) => createDateTime({ date }).date}
    invalidFormatText={invalidFormatText}
  />
);
