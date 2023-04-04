import { PropsWithChildren } from 'react';

import { DescriptionIcon, IDescription } from 'components/DescriptionIcon/DescriptionIcon';

import styles from './ChartBox.module.css';

interface IChartBoxProps {
  description?: IDescription;
}

/**
 * Universal chart wrapper, can wrap any chart implementation (e.g. ChartJs or Patternfly React Charts).
 * Supposed to be used directly by chart implementations ({@link DoughnutChart}).
 * Wrapper positions chart and help icon in right place.
 *
 * @param children - Chart (probably canvas element)
 * @param description - Description to be displayed in help icon
 */
export const ChartBox = ({ children, description }: PropsWithChildren<IChartBoxProps>) => {
  return (
    <div className={styles['chart-box']}>
      {description && <DescriptionIcon description={description} />}
      <div className={styles['chart-body']}>
        <div className={styles['canvas-wrapper']}>{children}</div>
      </div>
    </div>
  );
};
