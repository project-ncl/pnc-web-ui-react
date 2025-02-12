import { Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import Chart, { ChartConfiguration, TooltipItem } from 'chart.js/auto';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Build } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { calculateBuildName } from 'components/BuildName/BuildName';
import { Select } from 'components/Select/Select';
import { SelectOption } from 'components/Select/SelectOption';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

import { calculateDurationDiff, formatBuildMetricsTime } from 'utils/utils';

import styles from './BuildMetrics.module.css';

interface IBuildMetricsProps {
  builds: Build[];
  chartType: 'line' | 'horizontalBar';
  componentId: string;
}

interface IBuildMetrics {
  builds: Build[];
  buildMetricsData: IBuildMetricsData[];
}

interface IBuildMetricsData {
  name: string;
  data: number[];
  label: string;
}

interface IMetricsTooltip {
  label: string;
  description: string;
}

interface Metrics {
  color: string;
  label: string;
  description: string;
  skip?: boolean;
}

interface MetricsData {
  [key: string]: Metrics;
}

const BUILDS_DISPLAY_LIMIT = 20;
const BUILDS_DISPLAY_LIMIT_EXAMPLE = 5;
const MIN_HEIGHT = 300;
const MIN_HEIGHT_SINGLE_BUILD = 400;

/**
 * Generate time title according to the metric value
 *
 * @param metricValueData - Metric value coming from the REST API
 */
const generateTimeTitle = (metricValueData: number | string): string => {
  // Chart.js converts null values to the string "NaN"
  if (metricValueData === null || metricValueData === 'NaN') {
    return 'Not Available';
  }
  return calculateDurationDiff(metricValueData) || 'Not Available';
};

/**
 * Color and label data for each metric
 * Colors are based on v4-archive.patternfly.org/v4/guidelines/colors
 */
const METRICS_DATA: MetricsData = {
  WAITING_FOR_DEPENDENCIES: {
    color: '#B2A3FF',
    label: 'Waiting',
    description: 'Waiting for dependencies',
  },
  ENQUEUED: {
    color: '#C8EB79',
    label: 'Enqueued',
    description: 'Waiting to be started, the metric ends with the BPM process being started from PNC Orchestrator',
  },
  SCM_CLONE: {
    color: '#73C5C5',
    label: 'SCM Clone',
    description: 'Cloning / Syncing from Gerrit',
  },
  ALIGNMENT_ADJUST: {
    color: '#EF9234',
    label: 'Alignment',
    description: 'Alignment only',
  },
  BUILD_ENV_SETTING_UP: {
    color: '#7CDBF3',
    label: 'Starting Environment',
    description: 'Requesting to start new Build Environment in OpenShift',
  },
  REPO_SETTING_UP: {
    color: '#00B9E4',
    label: 'Artifact Repos Setup',
    description: 'Creating per build artifact repositories in Indy',
  },
  BUILD_SETTING_UP: {
    color: '#008BAD',
    label: 'Building',
    description: 'Uploading the build script, running the build, downloading the results (logs)',
  },
  COLLECTING_RESULTS_FROM_BUILD_DRIVER: {
    color: 'black',
    label: 'Collecting Results From Build Driver',
    description: '',
    skip: true,
  },
  SEALING_REPOSITORY_MANAGER_RESULTS: {
    color: '#CBC1FF',
    label: 'Sealing',
    description: 'Sealing artifact repository in Indy',
  },
  COLLECTING_RESULTS_FROM_REPOSITORY_MANAGER: {
    color: '#8476D1',
    label: 'Promotion',
    description: 'Downloading the list of built artifact and dependencies from Indy, promoting them to shared repository in Indy',
  },
  FINALIZING_BUILD: {
    color: '#5BA352',
    label: 'Finalizing',
    description: 'Completing all other build execution tasks, destroying build environments, invoking the BPM',
  },
  OTHER: {
    color: 'silver',
    label: 'Other',
    description: 'Other tasks from the time when the build was submitted to the time when the build ends',
  },
};

/**
 * Return color and label for each metric
 *
 * @param metricName - Metric name coming from the REST API
 */
const adaptMetric = (metricName: string): Metrics => {
  const metric = METRICS_DATA[metricName];
  if (metric) {
    return metric;
  } else {
    console.warn(`adaptMetric: Unknown metric name: "${metricName}"`, metricName);
    return {
      color: 'gray',
      label: metricName,
      description: 'Unknown metric',
    };
  }
};

const navigationOptions = [
  { id: 1, name: '1st' },
  { id: 2, name: '2nd' },
  { id: 3, name: '3rd' },
  { id: 5, name: '5th' },
  { id: 10, name: '10th' },
];

/**
 * Get navigation id by navigation option name
 *
 * @param name - Navigation option name
 */
const getNavigationIdByName = (name: string): number => {
  const foundOption = navigationOptions.find((option) => option.name === name);
  return foundOption ? foundOption.id : 1;
};

/**
 * Convert builds into an array of build ids as strings
 *
 * @param builds - List of builds
 */
const getBuildIds = (builds?: Build[]): string[] | undefined => builds?.map((build) => build.id.toString());

/**
 * Render the popover content for metrics tooltip
 *
 * @param metricsTooltipList - List of metric tooltips
 */
const MetricsPopoverContent = (metricsTooltipList: IMetricsTooltip[]) => (
  <div>
    Each metric consists of several subtasks:
    {metricsTooltipList.map((tooltip) => (
      <dl className={styles['pnc-popover-paragraph']} key={tooltip.label}>
        <dt>
          <b>{tooltip.label}</b>
        </dt>
        <dd>{tooltip.description}</dd>
      </dl>
    ))}
  </div>
);

/**
 * Filter (sample) builds from the provided array
 *
 * @param buildsArray - Array of builds
 * @param nth - Sample every nth build
 * @param max - Maximum number of builds to display (default: BUILDS_DISPLAY_LIMIT)
 */
const sampleBuilds = (buildsArray: Build[], nth: number, max: number = BUILDS_DISPLAY_LIMIT): Build[] => {
  const sampled: Build[] = [];

  for (let i = 0; i < buildsArray.length && sampled.length < max; i += nth) {
    sampled.push(buildsArray[i]);
  }

  return sampled;
};

/**
 * The component representing Build Metrics charts
 *
 * @param builds - List of Builds
 * @param chartType - Possible values: 'line' or 'horizontalBar'
 * @param componentId - Unique component id
 *
 * @example
 * <BuildMetrics builds={buildList} chartType="line" componentId="BUILD_CONFIG_METRICS" />
 */
export const BuildMetrics = ({ builds, chartType, componentId }: IBuildMetricsProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [selectedNavigation, setSelectedNavigation] = useState<string>('1st');
  const [buildMetrics, setBuildMetrics] = useState<IBuildMetrics>();
  const [metricsTooltipList, setMetricsTooltipList] = useState<IMetricsTooltip[]>([]);

  const serviceContainerBuildMetrics = useServiceContainer(buildApi.getBuildMetrics);
  const runBuildMetricsService = serviceContainerBuildMetrics.run;

  // Cache dropdown menu options
  const navigationSelectOptions = useMemo(
    () => navigationOptions.map((option) => <SelectOption key={option.id} option={option.name} />),
    []
  );

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Fetch build metrics when builds or navigation selection changes
  useEffect(() => {
    const nth = getNavigationIdByName(selectedNavigation);
    const filteredBuilds = sampleBuilds(builds, nth, BUILDS_DISPLAY_LIMIT);
    const buildIds = getBuildIds(filteredBuilds);
    if (buildIds) {
      runBuildMetricsService({
        serviceData: { buildIds },
        onSuccess: (result) => {
          setBuildMetrics({
            builds: filteredBuilds,
            buildMetricsData: result.response.data as IBuildMetricsData[],
          });
        },
      });
    }
  }, [builds, selectedNavigation, runBuildMetricsService]);

  // Cache computed chart container minimum height
  const computedChartHeight = useMemo(() => {
    if (chartType === 'horizontalBar' && buildMetrics) {
      const numBuilds = buildMetrics.builds.length;
      const heightTmp = numBuilds * 30;
      return heightTmp < MIN_HEIGHT ? (numBuilds === 1 ? MIN_HEIGHT_SINGLE_BUILD : MIN_HEIGHT) : heightTmp;
    }
    return MIN_HEIGHT;
  }, [chartType, buildMetrics]);

  const onToggleSelect = useCallback((isOpen: boolean) => {
    setIsSelectOpen(isOpen);
  }, []);

  const onNavigationSelect = useCallback((event: React.MouseEvent<Element, MouseEvent> | undefined, value: string) => {
    setSelectedNavigation(value);
    setIsSelectOpen(false);
  }, []);

  // Update chart when buildMetrics, chartType, or metricsTooltipList changes
  useEffect(() => {
    if (!buildMetrics || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Prepare chart data
    const labels = buildMetrics.builds.map((build) => calculateBuildName(build));
    let datasets = buildMetrics.buildMetricsData.filter((data) => !adaptMetric(data.name).skip);

    // Compute sum of metrics for each build index
    const buildMetricsSum: number[] = new Array(buildMetrics.builds.length).fill(0);
    datasets.forEach((dataset) => {
      dataset.data.forEach((value, index) => {
        buildMetricsSum[index] += value;
      });
    });

    // Compute "Other" metric data for each build
    const otherMetricData: number[] = buildMetrics.builds.map((build, index) => {
      const submitTime = new Date(build.submitTime!);
      const endTime = new Date(build.endTime!);
      const diff = endTime.getTime() - submitTime.getTime() - buildMetricsSum[index];
      return diff > 0 ? diff : 0;
    });

    // Update or add the "OTHER" dataset
    const otherDataset = datasets.find((data) => data.name === 'OTHER');
    if (otherDataset) {
      otherDataset.data = otherMetricData;
    } else {
      datasets.push({
        name: 'OTHER',
        data: otherMetricData,
        label: 'Other',
      });
    }
    const chartData = { labels, datasets };

    // Update metrics tooltip list
    const newTooltipList: IMetricsTooltip[] = datasets.map((dataset) => {
      const metric = adaptMetric(dataset.name);
      return {
        label: metric.label,
        description: metric.description,
      };
    });
    if (JSON.stringify(newTooltipList) !== JSON.stringify(metricsTooltipList)) {
      setMetricsTooltipList(newTooltipList);
    }

    let chartConfig: ChartConfiguration;

    if (chartType === 'line') {
      // Adapt datasets for line chart
      datasets.forEach((dataset) => {
        const metric = adaptMetric(dataset.name);
        Object.assign(dataset, {
          label: metric.label,
          fill: false,
          borderColor: metric.color,
          borderWidth: 4,
          pointBackgroundColor: metric.color,
          pointBorderColor: 'white',
          pointBorderWidth: 1.5,
          pointRadius: 4,
        });
      });
      chartConfig = {
        type: 'line',
        data: chartData,
        options: {
          maintainAspectRatio: false,
          elements: { line: { tension: 0.5 } },
          animation: { duration: 0 }, // disable animation
          scales: {
            y: {
              type: 'logarithmic',
              title: { display: true, text: 'Logarithmic scale' },
              ticks: { maxTicksLimit: 8, callback: generateTimeTitle },
            },
            x: { reverse: true },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems: TooltipItem<'line'>[]) => tooltipItems[0].label || '',
                label: (tooltipItem: TooltipItem<'line'>) => {
                  const dataset = chartData.datasets[tooltipItem.datasetIndex];
                  const label = dataset.label || '';
                  const value = dataset.data[tooltipItem.dataIndex] as number;
                  if (value === 0) return '';
                  return `${label}: ${formatBuildMetricsTime(value)}`;
                },
              },
            },
          },
        },
      };
    } else if (chartType === 'horizontalBar') {
      // Adapt datasets for horizontal bar chart
      datasets.forEach((dataset) => {
        const metric = adaptMetric(dataset.name);
        Object.assign(dataset, {
          label: metric.label,
          backgroundColor: metric.color,
        });
      });
      chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
          maintainAspectRatio: false,
          indexAxis: 'y',
          animation: { duration: 0 }, // disable animation
          plugins: {
            tooltip: {
              position: 'nearest',
              mode: 'index',
              callbacks: {
                title: (tooltipItems: TooltipItem<'bar'>[]) => tooltipItems[0].label || '',
                label: (tooltipItem: TooltipItem<'bar'>) => {
                  const dataset = chartData.datasets[tooltipItem.datasetIndex];
                  const label = dataset.label || '';
                  const value = dataset.data[tooltipItem.dataIndex] as number;
                  if (value === 0) return '';
                  return `${label}: ${formatBuildMetricsTime(value)}`;
                },
              },
            },
          },
          scales: {
            x: {
              min: 0,
              position: 'bottom',
              ticks: { maxTicksLimit: 30, callback: generateTimeTitle },
              stacked: true,
              title: { display: true, text: 'Linear scale' },
            },
            y: {
              reverse: false,
              stacked: true,
            },
          },
          layout: { padding: { top: 20, bottom: 20 } },
        },
      };
    } else {
      console.warn('Unsupported chart type: ' + chartType);
      return;
    }

    // Set dynamic chart height based on build count
    const isSingleBuild = chartData.datasets[0].data.length === 1;
    if (chartType === 'horizontalBar') {
      const heightTmp = chartData.datasets[0].data.length * 30;
      chartRef.current.parentElement!.style.height =
        (heightTmp < MIN_HEIGHT ? (isSingleBuild ? MIN_HEIGHT_SINGLE_BUILD : MIN_HEIGHT) : heightTmp) + 'px';
      if (isSingleBuild && chartConfig.options) {
        chartConfig.options.layout = {
          ...chartConfig.options.layout,
          padding: 50,
        };
      }
    } else {
      chartRef.current.parentElement!.style.height = `${MIN_HEIGHT}px`;
    }

    // Destroy and recreate chart instance on every update
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, chartConfig);
  }, [buildMetrics, chartType, metricsTooltipList]);

  return (
    <div style={{ minHeight: `${computedChartHeight}px` }}>
      <ServiceContainerLoading {...serviceContainerBuildMetrics} title="Build Metrics">
        <div className={styles['pnc-build-metrics']}>
          <div className={styles['pnc-build-metrics-body']}>
            <div className={styles['pnc-build-metrics-help']}>
              <small>Select specific metric in the chart legend to filter it out:</small>
            </div>
            {metricsTooltipList.length > 0 && (
              <div className={`${styles['pnc-build-metrics-help']} ${styles['pnc-build-metrics-help--right']}`}>
                <small>
                  Metrics Descriptions &nbsp;
                  <Popover
                    aria-label="Basic popover"
                    bodyContent={MetricsPopoverContent(metricsTooltipList)}
                    showClose={false}
                    enableFlip={false}
                    position="left-start"
                  >
                    <span className={styles['pnc-build-metric-info-icon']}>
                      <InfoCircleIcon />
                    </span>
                  </Popover>
                </small>
              </div>
            )}
            <div className={styles['canvas-wrapper']}>
              {buildMetrics && buildMetrics.builds && buildMetrics.buildMetricsData && <canvas id={componentId} ref={chartRef} />}
            </div>
          </div>
          {buildMetrics?.builds?.length && buildMetrics.builds.length > 1 && (
            <div className={styles['pnc-build-metric-navigation']}>
              <div className="pull-left"></div>
              <div className="pull-right">
                Display every&nbsp;
                <Select
                  isOpen={isSelectOpen}
                  onToggle={onToggleSelect}
                  value={selectedNavigation}
                  onChange={onNavigationSelect}
                  isToggleFullWidth={false}
                  aria-labelledby={`${componentId}-select`}
                >
                  {navigationSelectOptions}
                </Select>
                &nbsp;build
                <Popover
                  aria-label="Basic popover"
                  bodyContent={`Always a maximum of ${BUILDS_DISPLAY_LIMIT} builds will be displayed if they are available, eg. if every ${BUILDS_DISPLAY_LIMIT_EXAMPLE}th build is displayed, ${BUILDS_DISPLAY_LIMIT} builds will cover last ${
                    BUILDS_DISPLAY_LIMIT * BUILDS_DISPLAY_LIMIT_EXAMPLE
                  } builds.`}
                  showClose={false}
                >
                  <small>
                    &nbsp;
                    <span className={styles['pnc-build-metric-info-icon']}>
                      <InfoCircleIcon />
                    </span>
                  </small>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </ServiceContainerLoading>
    </div>
  );
};
