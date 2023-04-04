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
 * Description for box components, for example @link ContentBox, displayed either within tooltip or popover.
 *
 * If description is string, tooltip is used.
 * If description is ReactNode, popover is used.
 *
 * @param description - Description to be displayed within tooltip / popover
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
