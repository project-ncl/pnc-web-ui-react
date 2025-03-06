import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';

import { IEntityAttributes } from 'common/entityAttributes';

import { DateTime } from 'components/DateTime/DateTime';

import { areDatesEqual, calculateDuration } from 'utils/utils';

interface ITimesListProps {
  submitTime?: string;
  startTime?: string;
  endTime?: string;
  entityAttributes: IEntityAttributes;
  isCompactMode: boolean;
}

export const TimesList = ({ submitTime, startTime, endTime, entityAttributes, isCompactMode }: ITimesListProps) => {
  const submitTimeTimeTitle = 'submitTime' in entityAttributes ? entityAttributes['submitTime'].title : undefined;
  const startTimeTimeTitle = 'startTime' in entityAttributes ? entityAttributes['startTime'].title : undefined;
  const endTimeTimeTitle = 'endTime' in entityAttributes ? entityAttributes['endTime'].title : undefined;

  const submitTimeItem = submitTimeTimeTitle && (
    <DescriptionListGroup>
      <DescriptionListTerm>{submitTimeTimeTitle}</DescriptionListTerm>
      <DescriptionListDescription>{submitTime && <DateTime date={submitTime} />}</DescriptionListDescription>
    </DescriptionListGroup>
  );

  const startTimeItem = startTimeTimeTitle && (
    <DescriptionListGroup>
      <DescriptionListTerm>{startTimeTimeTitle}</DescriptionListTerm>
      <DescriptionListDescription>
        {startTime && (
          <DateTime date={startTime} displayDate={isCompactMode || !submitTime || !areDatesEqual(submitTime, startTime)} />
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );

  const endTimeItem = endTimeTimeTitle && (
    <DescriptionListGroup>
      <DescriptionListTerm>{endTimeTimeTitle}</DescriptionListTerm>
      <DescriptionListDescription>
        {endTime && (
          <DateTime
            date={endTime}
            displayDate={
              isCompactMode ||
              (!!startTime && !areDatesEqual(startTime, endTime)) ||
              (!!submitTime && !areDatesEqual(submitTime, endTime))
            }
          />
        )}
        {startTime && endTime && ` (${isCompactMode ? '' : 'took '}${calculateDuration(startTime, endTime)})`}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );

  let content;
  if (isCompactMode) {
    if (endTime) {
      content = endTimeItem;
    } else if (startTime) {
      content = startTimeItem;
    } else if (submitTime) {
      content = submitTimeItem;
    }
  } else {
    content = (
      <>
        {submitTimeItem}
        {startTimeItem}
        {endTimeItem}
      </>
    );
  }

  return (
    <DescriptionList className="gap-0" isHorizontal isCompact isFluid={isCompactMode}>
      {content}
    </DescriptionList>
  );
};
