import { Popover, Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { AxiosResponse } from 'axios';
import Chart, { ChartConfiguration, TooltipItem } from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';

import { Build } from 'pnc-api-types-ts';

import { useServiceContainer } from 'hooks/useServiceContainer';

import { calculateBuildName } from 'components/BuildName/BuildName';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildApi from 'services/buildApi';

import { calculateDurationDiff, formatTime } from 'utils/utils';

import styles from './BuildMetrics.module.css';

interface IBuildMetricsProps {
  builds: Array<Build>;
  chartType: string;
  componentId: string;
}

interface IBuildMetrics {
  builds: Array<Build>;
  buildMetricsData: Array<IBuildMetricsData>;
}

interface IBuildMetricsCanvasProps {
  buildMetrics: IBuildMetrics;
  chartType: string;
  componentId: string;
}

interface IBuildMetricsData {
  name: string;
  data: Array<number>;
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
let metricsTooltipList: Array<IMetricsTooltip>;
let lineChart: Chart;
let barChart: Chart;

/**
 * Generate time title according to the metricValue.
 *
 *
 * @param {number | string} metricValue - Metric value coming from the REST API
 */
const generateTimeTitle = (metricValueData: number | string) => {
  // Chart.js converts null values to NaN string
  if (metricValueData === null || metricValueData === 'NaN') {
    return 'Not Available';
  }

  return calculateDurationDiff(metricValueData);
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
 * Return color and label for each metric.
 *
 * @param {string} metricsName - Metrics name coming from the REST API
 */
const adaptMetrics = (metricsName: string) => {
  const metric = METRICS_DATA[metricsName];
  if (metric) {
    return metric;
  } else {
    console.warn('adaptMetric: Unknown metric name: "' + metricsName + '"', metricsName);
    return {
      color: 'gray',
      label: metricsName,
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

const getNavigationIdByName = (name: string) => navigationOptions.find((option) => option.name === name)?.id!;

const generateBuildTitle = (buildName: string) => '#' + buildName;

/**
 * Load Build Metrics for specified builds.
 *
 * @param {Object[]} builds - List of Builds.
 */
const transferBuildsToBuildId = (builds?: Array<Build>) => {
  if (builds) {
    return builds.map((build) => {
      return build.id.toString();
    });
  }
};

const MetricsPopoverContent = (metricsTooltipList: Array<IMetricsTooltip>) => {
  return (
    <div>
      Each metric consists of several subtasks:
      {metricsTooltipList.map((metricsTooltip) => {
        return (
          <dl className={styles['pnc-popover-paragraph']} key={metricsTooltip.label}>
            <dt>
              <b>{metricsTooltip.label}</b>
            </dt>
            <dd>{metricsTooltip.description}</dd>
          </dl>
        );
      })}
    </div>
  );
};

const BuildMetricsCanvas = ({ buildMetrics, chartType, componentId }: IBuildMetricsCanvasProps) => {
  const isCanvasInit = useRef<boolean>(true);
  const chartRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  useEffect(() => {
    const lineChartConfig: ChartConfiguration = { type: 'line', data: { datasets: [] }, options: {} };
    const barChartConfig: ChartConfiguration = { type: 'bar', data: { datasets: [] }, options: {} };
    const updateChartConfig = () => {
      // Chart is pointing to single instance of chartConfig declared on the Controller level and providing later updates based on it's changes.
      let adaptedMetric;
      const buildIds = buildMetrics.builds.map((build) => build.id.toString());

      // skip specific metrics
      const filteredData = buildMetrics.buildMetricsData
        ? buildMetrics.buildMetricsData.filter((item) => !adaptMetrics(item.name).skip)
        : [];

      const buildMetricsData = {
        labels: buildMetrics.builds.map((build) => calculateBuildName(build)),
        datasets: filteredData,
      };

      // sum individual metrics for given build
      const buildMetricsSum = new Array(buildIds.length).fill(0);

      for (let m = 0; m < buildMetricsData.datasets.length; m++) {
        for (let n = 0; n < buildMetricsData.datasets[m].data.length; n++) {
          buildMetricsSum[n] += buildMetricsData.datasets[m].data[n];
        }
      }

      // compute Other metrics
      const metricOthersData: Array<number> = [];

      for (let k = 0; k < buildMetrics.builds.length; k++) {
        const submitTime = new Date(buildMetrics.builds[k].submitTime!);
        const endTime = new Date(buildMetrics.builds[k].endTime!);
        const metricOther = endTime.getTime() - submitTime.getTime() - buildMetricsSum[k];
        metricOthersData.push(metricOther > 0 ? metricOther : 0);
      }

      const otherData = buildMetricsData.datasets.find((data) => data.name === 'OTHER');
      if (otherData) {
        otherData.data = metricOthersData;
      } else {
        buildMetricsData.datasets.push({
          name: 'OTHER',
          data: metricOthersData,
        });
      }
      // generate tooltip content
      metricsTooltipList = buildMetricsData.datasets.map((item) => {
        adaptedMetric = adaptMetrics(item.name);
        return {
          label: adaptedMetric.label,
          description: adaptedMetric.description,
        };
      });

      if (chartType === 'line') {
        for (let i = 0; i < buildMetricsData.datasets.length; i++) {
          adaptedMetric = adaptMetrics(buildMetricsData.datasets[i].name);

          Object.assign(buildMetricsData.datasets[i], {
            label: adaptedMetric.label,
            fill: false,

            // lines
            borderColor: adaptedMetric.color,
            borderWidth: 4,

            // points
            pointBackgroundColor: adaptedMetric.color,
            pointBorderColor: 'white',
            pointBorderWidth: 1.5,
            pointRadius: 4,
          });
        }
        lineChartConfig.options = {
          maintainAspectRatio: false,
          elements: {
            line: {
              tension: 0.5,
            },
          },
          animation: {
            duration: 0, // disable animation
          },
          scales: {
            y: {
              type: 'logarithmic',
              title: {
                display: true,
                text: 'Logarithmic scale',
              },
              ticks: {
                maxTicksLimit: 8,
                callback: generateTimeTitle,
              },
            },
            x: {
              reverse: true,
            },
          },
        };
      } else if (chartType === 'horizontalBar') {
        for (let j = 0; j < buildMetricsData.datasets.length; j++) {
          adaptedMetric = adaptMetrics(buildMetricsData.datasets[j].name);
          Object.assign(buildMetricsData.datasets[j], {
            label: adaptedMetric.label,
            backgroundColor: adaptedMetric.color,
          });
        }

        barChartConfig.options = {
          indexAxis: 'y' as const,
          plugins: {
            tooltip: {
              position: 'nearest',
              mode: 'index',
              intersect: false,
              callbacks: {
                title: (tooltipItems: TooltipItem<'bar'>[]) => {
                  return tooltipItems[0].label || '';
                },
                label: (tooltipItem: TooltipItem<'bar'>) => {
                  const dataset = buildMetricsData.datasets[tooltipItem.datasetIndex];
                  const label = dataset.name || '';
                  const value = dataset.data[tooltipItem.dataIndex] as number;
                  if (value === 0) return '';
                  const formattedValue = formatTime(value);
                  return value ? `${label}: ${formattedValue} (${value}ms)` : '';
                },
              },
            },
          },
          animation: {
            duration: 0, // disable animation
          },
          scales: {
            x: {
              min: 0,
              position: 'bottom',
              ticks: {
                maxTicksLimit: 30,
                callback: generateTimeTitle,
              },
              stacked: true,
              title: {
                display: true,
                text: 'Linear scale',
              },
            },
            y: {
              reverse: false,
              stacked: true,
            },
          },
        };
      } else {
        console.warn('Unsupported chart type: ' + chartType);
      }

      const isSingleBuild = buildMetricsData.datasets[0].data.length === 1;

      const commonChartConfig = {
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            title: (tooltipItems: Array<any>) => generateBuildTitle(tooltipItems[0].label),
            label: (tooltipItem: any, data: any) => {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                label += ': ' + generateTimeTitle(tooltipItem.value);
              }
              if (tooltipItem.value !== 'NaN' && tooltipItem.value > 1000) {
                label += '  (' + tooltipItem.value + ' ms)';
              }
              return label;
            },
          },
        },
      };
      const commonChartPlugins = [
        {
          id: '',
          beforeInit: (chart: any) => {
            chart.legend.afterFit = () => {
              chart.height = chart.height + 25;
            };
          },
        },
      ];
      lineChartConfig.data = buildMetricsData;
      barChartConfig.data = buildMetricsData;

      // increase space between legend and chart
      let heightTmp = 0;
      const MIN_HEIGHT = 290;
      const MIN_HEIGHT_SINGLE_BUILD = 400;

      if (chartType === 'horizontalBar') {
        Object.assign(barChartConfig.options!, commonChartConfig);
        barChartConfig.plugins = commonChartPlugins;
        heightTmp = buildMetricsData.datasets[0].data.length * 30;
        chartRef.current!.parentElement!.style.height =
          (heightTmp < MIN_HEIGHT ? (isSingleBuild ? MIN_HEIGHT_SINGLE_BUILD : MIN_HEIGHT) : heightTmp) + 'px';
        if (isSingleBuild) {
          barChartConfig.options!.layout!.padding = 50;
        }
      } else {
        Object.assign(lineChartConfig.options!, commonChartConfig);
        lineChartConfig.plugins = commonChartPlugins;
        chartRef.current!.parentElement!.style.height = '300px';
      }
    };
    updateChartConfig();
    if (chartType === 'line' && lineChart) {
      lineChart.config.data = lineChartConfig.data;
      lineChart.config.options = lineChartConfig.options;
      lineChart.update();
    } else if (chartType === 'horizontalBar' && barChart) {
      barChart.config.data = barChartConfig.data;
      barChart.config.options = barChartConfig.options;
      barChart.update();
    }
    if (isCanvasInit.current) {
      if (chartType === 'line') {
        const lineCtx = chartRef.current?.getContext('2d');
        if (!lineCtx) {
          throw new Error('Chart.JS: Failed to get 2D context');
        }
        lineChart = new Chart(lineCtx, lineChartConfig);
      } else if (chartType === 'horizontalBar') {
        const barCtx = chartRef.current?.getContext('2d');
        if (!barCtx) {
          throw new Error('Chart.JS: Failed to get 2D context');
        }
        barChart = new Chart(barCtx, barChartConfig);
      }
      isCanvasInit.current = false;
    }
  }, [chartRef, chartType, buildMetrics.buildMetricsData, buildMetrics.builds]);
  return <canvas id={componentId} ref={chartRef} />;
};

/**
 * The component representing Build Metric charts.
 *
 * @param {Object[]} builds - List of Builds.
 * @param {string} chartType - Possible values: line, horizontalBar
 * @param {string} componentId - Unique component id.
 *
 * @example
 * ```tsx
 * <BuildMetrics builds={buildList} chartType="line" componentId="BUILD_CONFIG_METRICS"></BuildMetrics>
 * ```
 *
 */
export const BuildMetrics = ({ builds, chartType, componentId }: IBuildMetricsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('1st');
  const [buildMetrics, setBuildMetrics] = useState<IBuildMetrics>();

  const serviceContainerBuildMetrics = useServiceContainer(buildApi.getBuildMetrics);
  const serviceContainerBuildMetricsRunner = serviceContainerBuildMetrics.run;

  const navigationSelectOptions: Array<any> = navigationOptions.map((option) => (
    <SelectOption key={option.id} value={option.name} />
  ));

  useEffect(() => {
    /**
     * Filter array using Nth and max parameters.
     *
     * @param {array} array - Full array to be filtered.
     * @param {number} nth - Returned array will contain only every Nth item.
     * @param {number} max [20] - Returned array max size.
     */
    const filterBuilds = (array: Array<Build>, nth: number, max: number = BUILDS_DISPLAY_LIMIT) => {
      const result: Build[] = [];
      for (let i = 0; i < array.length; i = i + nth) {
        result.push(array[i]);
      }

      return result.slice(0, max);
    };
    /* Load data according to the current filter */
    const currentFilteredBuilds: Build[] = filterBuilds(builds, getNavigationIdByName(selected));
    const buildIds = transferBuildsToBuildId(currentFilteredBuilds);
    if (buildIds) {
      serviceContainerBuildMetricsRunner({ serviceData: { buildIds } }).then((res: AxiosResponse) => {
        setBuildMetrics({
          builds: currentFilteredBuilds,
          buildMetricsData: res.data,
        });
      });
    }
  }, [builds, selected, serviceContainerBuildMetricsRunner]);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = (event: any, value: any) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <>
      <ServiceContainerLoading {...serviceContainerBuildMetrics} title="Build Metrics">
        <div className={styles['pnc-build-metrics']}>
          <div className={styles['pnc-build-metrics-body']}>
            <div className={styles['pnc-build-metrics-help']}>
              <small>Select specific metric in the chart legend to filter it out:</small>
            </div>
            {metricsTooltipList && (
              <div className={`${styles['pnc-build-metrics-help']} ${styles['pnc-build-metrics-help--right']}`}>
                <small>
                  Metrics Descriptions &nbsp;
                  <Popover
                    removeFindDomNode
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
              {buildMetrics && buildMetrics.builds && buildMetrics.buildMetricsData && (
                <BuildMetricsCanvas
                  buildMetrics={buildMetrics!}
                  chartType={chartType}
                  componentId={componentId}
                ></BuildMetricsCanvas>
              )}
            </div>
          </div>
          {buildMetrics?.builds?.length! > 1 && (
            <form className={styles['pnc-build-metric-navigation']}>
              <div className="pull-left"></div>
              <div className="pull-right" ng-if="$ctrl.builds.length > 1">
                Display every&nbsp;
                <Select
                  width={100}
                  variant={SelectVariant.single}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  selections={selected}
                  isOpen={isOpen}
                  aria-labelledby={`${componentId}-select`}
                >
                  {navigationSelectOptions}
                </Select>
                &nbsp;build
                <Popover
                  removeFindDomNode
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
            </form>
          )}
        </div>
      </ServiceContainerLoading>
    </>
  );
};
