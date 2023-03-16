import { Chart, ChartConfiguration } from 'chart.js';
import { useEffect, useRef } from 'react';

import { ChartBox, ChartDescription } from 'components/Charts/ChartBox';

import { dougnutCenterPlugin, legendHeightPlugin } from 'libs/chartJSPlugins';

/**
 * @example
 * {
 *   BUILT: 25,
 *   IMPORTED: 65,
 *   DEPRECATED: 10
 * }
 */
interface DoughnutData {
  [key: string]: number;
}

interface IDoughnutChartProps {
  data: DoughnutData;
  id?: string;
  description?: ChartDescription;
  legendHeight?: number;
}

/**
 * Chart.js Dougnut chart.
 *
 * @param data - Chart data
 * @param id - ID of canvas
 * @param description - Description to be displayed in help icon
 * @param legendHeight - Legend height
 */
export const DoughnutChart = ({ data, id, description, legendHeight }: IDoughnutChartProps) => {
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
            fontStyle:
              '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          },
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
      plugins: [...(legendHeight ? [legendHeightPlugin] : []), dougnutCenterPlugin],
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
  }, [data, legendHeight]);

  return (
    <ChartBox description={description}>
      <canvas id={id} ref={chartRef} />
    </ChartBox>
  );
};
