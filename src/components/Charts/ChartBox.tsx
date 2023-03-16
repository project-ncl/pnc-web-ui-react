import { Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { PropsWithChildren } from 'react';

import styles from './ChartBox.module.css';

interface ChartDescriptionAttribute {
  label: string;
  value: string;
}

export interface ChartDescription {
  textTop?: string;
  attributes?: ChartDescriptionAttribute[];
}

interface IChartBoxProps {
  description?: ChartDescription;
}

/**
 * Wrapper for charts. Positions chart and help icon in right place.
 *
 * @param children - Chart (probably canvas element)
 * @param description - Description to be displayed in help icon
 */
export const ChartBox = ({ children, description }: PropsWithChildren<IChartBoxProps>) => {
  return (
    <div className={styles['chart-body']}>
      {description && (
        <Popover
          removeFindDomNode
          bodyContent={
            <div>
              {description.textTop}
              {description.attributes &&
                description.attributes.map((attribute: ChartDescriptionAttribute, index: number) => (
                  <dl className={styles['popover-attribute']} key={index}>
                    <dt>
                      <b>{attribute.label}</b>
                    </dt>
                    <dd>{attribute.value}</dd>
                  </dl>
                ))}
            </div>
          }
          showClose={false}
          enableFlip={false}
          position="left-start"
        >
          <div className={styles['chart-description']}>
            <small>
              <span className={styles['info-icon']}>
                <InfoCircleIcon />
              </span>
            </small>
          </div>
        </Popover>
      )}
      <div className={styles['canvas-wrapper']}>{children}</div>
    </div>
  );
};
