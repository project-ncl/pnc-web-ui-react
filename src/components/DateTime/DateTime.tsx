import { css } from '@patternfly/react-styles';
import { useMemo } from 'react';

import { createDateTime } from 'utils/utils';

import styles from './DateTime.module.css';

interface IDateTimeProps {
  date: Date | string;
  displayDate?: boolean;
  displayTime?: boolean;
}

export const DateTime = ({ date, displayDate = true, displayTime = true }: IDateTimeProps) => {
  const dateTimeObject = useMemo(
    () => createDateTime({ date, includeDateInCustom: displayDate, includeTimeInCustom: displayTime }),
    [date, displayDate, displayTime]
  );

  return (
    <>
      {displayDate && (
        <span className={css(styles['date-span'], displayTime && styles['displayed-time'])}>{dateTimeObject.date}</span>
      )}
      {displayTime && <span>{dateTimeObject.time}</span>}
    </>
  );
};
