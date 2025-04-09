import { ReactNode } from 'react';

import { InfoTooltip } from 'components/InfoTooltip/InfoTooltip';

import styles from './BoxDescription.module.css';

export type IDescription = ReactNode;

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
    <InfoTooltip tooltip={description} color="blue" tooltipPosition="left-start" />
  </div>
);
