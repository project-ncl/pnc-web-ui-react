import { Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { Chart, ChartConfiguration } from 'chart.js';
import { useEffect, useRef } from 'react';

import { dougnutCenterPlugin } from 'utils/chartJSPlugins';

import styles from './DoughnutChart.module.css';

Chart.register(dougnutCenterPlugin);

interface DescriptionAttribute {
  label: string;
  value: string;
}

interface IDoughnutChartProps {
  data: {
    [key: string]: number;
  };
  title?: string;
  id?: string;
  description?: {
    textTop?: string;
    attributes?: DescriptionAttribute[];
  };
}

export const DoughnutChart = ({ data, title, id, description }: IDoughnutChartProps) => {
  const chart = useRef<Chart>();
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const labels = data ? Object.keys(data) : [];
    const values = data ? Object.values(data) : [];

    const chartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: values,
          },
        ],
        labels: labels,
      },
      options: {
        elements: {
          center: {
            text: values.reduce((a, b) => a + b, 0),
            fontStyle: 'Segoe UI',
          },
        } as any,
        plugins: {
          title: title
            ? {
                text: title,
                align: 'center',
                position: 'bottom',
                display: true,
              }
            : undefined,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    if (!chart.current) {
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) {
        throw new Error('Chart.JS: Failed to get 2D context');
      }
      chart.current = new Chart(ctx, chartConfig);
    } else {
      chart.current.config.data = chartConfig.data;
      chart.current.config.options = chartConfig.options;
      chart.current.update();
    }
  }, [data, title]);

  return (
    <div className={styles['chart-body']}>
      <div className={styles['chart-help']}>
        <small>Select specific property in the chart legend to filter it out:</small>
      </div>
      {description && (
        <Popover
          removeFindDomNode
          bodyContent={
            <div>
              {description.textTop}
              {description.attributes &&
                description.attributes.map((attribute: DescriptionAttribute, index: number) => (
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
          <div className={css(styles['chart-help'], styles['chart-help--right'])}>
            <small>
              Descriptions &nbsp;
              <span className={styles['info-icon']}>
                <InfoCircleIcon />
              </span>
            </small>
          </div>
        </Popover>
      )}
      <div className={styles['canvas-wrapper']}>
        <canvas id={id} ref={chartRef} />
      </div>
    </div>
  );
};
