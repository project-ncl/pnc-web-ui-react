import { DatePicker as DatePickerPF } from '@patternfly/react-core';
import { FormEvent } from 'react';

import { createDateTime } from 'utils/utils';

interface IDatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (event: FormEvent | undefined, date: string) => void;
  onBlur: () => void;
  invalidFormatText?: string;
  includeTime?: boolean;
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
 * @param includeTime - Extends date picker to date-time picker
 */
export const DatePicker = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  invalidFormatText = '',
  includeTime = false,
}: IDatePickerProps) => (
  <DatePickerPF
    id={id}
    name={name}
    placeholder={`YYYY-MM-DD${includeTime ? ' HH:MM' : ''}`}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    dateFormat={(date: Date) => (includeTime ? createDateTime({ date }).custom : createDateTime({ date }).date)}
    invalidFormatText={invalidFormatText}
  />
);
