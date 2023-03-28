import { Chart, ChartConfiguration } from 'chart.js';
import { useEffect, useRef } from 'react';

import { IDescription } from 'components/BoxDescription/BoxDescription';
import { ChartBox } from 'components/Charts/ChartBox';
import { COLORS } from 'components/Charts/common';

import { legendHeightPlugin } from 'libs/chartJSPlugins';

/**
 * @example
 * {
 *   label: "BUILT",
 *   data: [17, 10, 23]
 * }
 */
interface IStackedBarChartDataset {
  label: string;
  data: number[];
}

export interface IStackedBarChartProps {
  data: IStackedBarChartDataset[];
  labels: string[];
  id?: string;
  description?: IDescription;
  legendHeight?: number;
}

/**
 * Chart.js horizontal Stacked Bar chart.
 *
 * @param data - Chart data
 * @param labels - Labels of stacked rows
 * @param id - ID of canvas
 * @param description - Description to be displayed in help icon
 * @param legendHeight - Legend height
 */
export const StackedBarChart = ({ data, labels, id, description, legendHeight = 100 }: IStackedBarChartProps) => {
  const chart = useRef<Chart>();
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        datasets: data.map((dataset: IStackedBarChartDataset, index: number) => {
          return { ...dataset, backgroundColor: COLORS[index % COLORS.length] };
        }),
        labels: labels,
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
          },
        },
        elements: {
          legend: {
            height: legendHeight,
          },
        } as any,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 25,
              color: 'black',
              font: {
                size: 15,
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      plugins: [...(legendHeight ? [legendHeightPlugin] : [])],
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
  }, [data, labels, legendHeight]);

  return (
    <ChartBox description={description}>
      <canvas id={id} ref={chartRef} />
    </ChartBox>
  );
};
