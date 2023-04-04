import { Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { ReactNode } from 'react';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './BoxDescription.module.css';

const DescriptionIcon = () => (
  <span className={styles['description-icon']}>
    <InfoCircleIcon />
  </span>
);

export type IDescription = ReactNode | string;

interface IBoxDescriptionProps {
  description: IDescription;
}

/**
 * Icon with description displayed on hover event.
 *
 * Of description is string, tooltip is used, popover otherwise.
 *
 * @param description - Description to be displayed on icon hover
 */
export const BoxDescription = ({ description }: IBoxDescriptionProps) => (
  <div className={styles['box-description']}>
    {typeof description === 'string' ? (
      <TooltipWrapper tooltip={description}>
        <DescriptionIcon />
      </TooltipWrapper>
    ) : (
      <Popover removeFindDomNode bodyContent={description} showClose={false} enableFlip={false} position="left-start">
        <DescriptionIcon />
      </Popover>
    )}
  </div>
);
