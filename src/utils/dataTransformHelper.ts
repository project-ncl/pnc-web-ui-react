// module to transform backend data or infer other data from them
import { IDoughnutChartProps } from 'components/Charts/DoughnutChart';
import { IStackedBarChartProps } from 'components/Charts/StackedBarChart';

export const doughnutChartDataTransform = (data: any): IDoughnutChartProps['data'] => (data ? Object.values(data) : []);

export const doughnutChartLabelTransform = (data: any): IDoughnutChartProps['labels'] => (data ? Object.keys(data) : []);

export const stackedBarChartDataTransform = (data: any, statisticsGroup: string): IStackedBarChartProps['data'] =>
  data &&
  data.length &&
  Object.keys(data[0][statisticsGroup]).map((statisticsName: string) => ({
    label: statisticsName,
    data: data.map((productMilestoneData: any) => productMilestoneData[statisticsGroup][statisticsName]),
  }));

export const stackedBarChartLabelTransform = (data: any): IStackedBarChartProps['labels'] =>
  data && data.map((productMilestoneData: any) => productMilestoneData.version);

export const stackedBarChartHeight = (data: any, legendHeight: number = 100): string =>
  data ? `${legendHeight + 70 + data.length * 75}px` : '300px';
