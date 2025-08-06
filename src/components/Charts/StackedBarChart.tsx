import { Chart, ChartConfiguration } from 'chart.js';
import { useTheme } from 'contexts/ThemeContext';
import { useEffect, useRef } from 'react';

import { IDescription } from 'components/BoxDescription/BoxDescription';
import { ChartBox } from 'components/Charts/ChartBox';
import { getColorValue } from 'components/Charts/common';

import { legendHeightPlugin } from 'libs/chartJsPlugins';

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
  colors: string[];
  id?: string;
  description?: IDescription;
  legendHeight?: number;
}

/**
 * Chart.js horizontal Stacked Bar chart.
 *
 * @param data - Chart data
 * @param labels - Labels of stacked rows
 * @param colors - Background colors for the chart data
 * @param id - ID of canvas
 * @param description - Description to be displayed in help icon
 * @param legendHeight - Legend height
 */
export const StackedBarChart = ({ data, labels, colors, id, description, legendHeight = 100 }: IStackedBarChartProps) => {
  const chart = useRef<Chart>();
  const chartRef = useRef<HTMLCanvasElement>(null);

  const { resolvedThemeMode } = useTheme();

  useEffect(() => {
    const style = getComputedStyle(document.body);

    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        datasets: data.map((dataset: IStackedBarChartDataset, index: number) => {
          return { ...dataset, backgroundColor: getColorValue(style, colors[index]) };
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
            maxHeight: legendHeight * 4,
            labels: {
              padding: 15,
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
  }, [data, labels, colors, legendHeight, resolvedThemeMode]);

  return (
    <ChartBox description={description}>
      <canvas id={id} ref={chartRef} />
    </ChartBox>
  );
};
