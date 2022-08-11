import { Popover, Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { AxiosResponse } from 'axios';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Build } from 'pnc-api-types-ts';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';

import { buildService } from '../../services/buildService';

import { calculateBuildName } from '../BuildName/BuildName';
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
  let metricValue: number;
  if (metricValueData === null || metricValueData === 'NaN') {
    return 'Not Available';
  } else {
    metricValue = metricValueData as number;
  }

  const SECOND_MS = 1000;
  const MINUTE_MS = 60 * SECOND_MS;
  const HOUR_MS = 60 * MINUTE_MS;
  const DAYS_MS = 24 * HOUR_MS;

  const time = {
    milliseconds: metricValue % SECOND_MS,
    seconds: Math.floor((metricValue / SECOND_MS) % 60),
    minutes: Math.floor((metricValue / MINUTE_MS) % 60),
    hours: Math.floor((metricValue / HOUR_MS) % 24),
    days: Math.floor(metricValue / DAYS_MS),
  };

  // days
  if (metricValue >= DAYS_MS) {
    return time.days + 'd ' + (time.hours ? time.hours + 'h' : '');
  }
  // hours
  if (metricValue >= HOUR_MS) {
    return time.hours + 'h ' + (time.minutes ? time.minutes + 'm' : '');
  }
  // minutes
  if (metricValue >= MINUTE_MS) {
    return time.minutes + 'm ' + (time.seconds ? time.seconds + 's' : '');
  }
  // seconds
  if (metricValue >= SECOND_MS) {
    return time.seconds + (time.milliseconds ? '.' + time.milliseconds + ' s' : ' s');
  }
  // ms
  return time.milliseconds + ' ms';
};

/**
 * Return color and label for each metric.
 *
 * Colors are based on patternfly.org/v3/styles/color-palette/
 *
 * @param {string} metricName - Metric name coming from the REST API
 */
const adaptMetric = (metricName: string) => {
  switch (metricName) {
    // purple
    case 'WAITING_FOR_DEPENDENCIES':
      return {
        color: '#a18fff',
        label: 'Waiting',
        description: 'Waiting for dependencies',
      };

    // light-green
    case 'ENQUEUED':
      return {
        color: '#c8eb79',
        label: 'Enqueued',
        description: 'Waiting to be started, the metric ends with the BPM process being started from PNC Orchestrator',
      };

    // cyan
    case 'SCM_CLONE':
      return {
        color: '#7dbdc3',
        label: 'SCM Clone',
        description: 'Cloning / Syncing from Gerrit',
      };

    // orange
    case 'ALIGNMENT_ADJUST':
      return {
        color: '#f7bd7f',
        label: 'Alignment',
        description: 'Alignment only',
      };

    // blue
    case 'BUILD_ENV_SETTING_UP':
      return {
        color: '#7cdbf3',
        label: 'Starting Environment',
        description: 'Requesting to start new Build Environment in OpenShift',
      };
    case 'REPO_SETTING_UP':
      return {
        color: '#00b9e4',
        label: 'Artifact Repos Setup',
        description: 'Creating per build artifact repositories in Indy',
      };
    case 'BUILD_SETTING_UP':
      return {
        color: '#008bad',
        label: 'Building',
        description: 'Uploading the build script, running the build, downloading the results (logs)',
      };

    // black
    case 'COLLECTING_RESULTS_FROM_BUILD_DRIVER':
      return {
        color: 'black',
        label: 'Collecting Results From Build Driver',
        description: '',
        skip: true,
      };

    // light purple
    case 'SEALING_REPOSITORY_MANAGER_RESULTS':
      return {
        color: '#c7bfff',
        label: 'Sealing',
        description: 'Sealing artifact repository in Indy',
      };

    // purple
    case 'COLLECTING_RESULTS_FROM_REPOSITORY_MANAGER':
      return {
        color: '#703fec',
        label: 'Promotion',
        description:
          'Downloading the list of built artifact and dependencies from Indy, promoting them to shared repository in Indy',
      };

    // green
    case 'FINALIZING_BUILD':
      return {
        color: '#3f9c35',
        label: 'Finalizing',
        description: 'Completing all other build execution tasks, destroying build environments, invoking the BPM',
      };

    // gray
    case 'OTHER':
      return {
        color: 'silver',
        label: 'Other',
        description: 'Other tasks from the time when the build was submitted to the time when the build ends',
      };

    default:
      console.warn('adaptMetric: Unknown metric name: "' + metricName + '"', metricName);
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
        ? buildMetrics.buildMetricsData.filter((item) => !adaptMetric(item.name).skip)
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

      // compute Other metric
      const metricOthersData = [];

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
        adaptedMetric = adaptMetric(item.name);
        return {
          label: adaptedMetric.label,
          description: adaptedMetric.description,
        };
      });

      if (chartType === 'line') {
        for (let i = 0; i < buildMetricsData.datasets.length; i++) {
          adaptedMetric = adaptMetric(buildMetricsData.datasets[i].name);

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
          },
        };
      } else if (chartType === 'horizontalBar') {
        for (let j = 0; j < buildMetricsData.datasets.length; j++) {
          adaptedMetric = adaptMetric(buildMetricsData.datasets[j].name);
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
  const dataContainer = useDataContainer(
    useCallback(({ serviceData, requestConfig }: IService<Array<Build>>) => {
      return buildService.getBuildMetrics(transferBuildsToBuildId(serviceData), requestConfig);
    }, [])
  );
  const dataContainerRefresh = dataContainer.refresh;
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
    dataContainerRefresh({ serviceData: currentFilteredBuilds, requestConfig: {} }).then((res: AxiosResponse) => {
      setBuildMetrics({
        builds: currentFilteredBuilds,
        buildMetricsData: res.data,
      });
    });
  }, [builds, selected, dataContainerRefresh]);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = (event: any, value: any) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <>
      <DataContainer {...dataContainer} title="Build Metrics">
        <div className={styles['pnc-build-metrics']}>
          <div className={styles['pnc-build-metrics-body']}>
            <div className={styles['pnc-build-metrics-help']}>
              <small>Select specific metric in the chart legend to filter it out:</small>
            </div>
            {metricsTooltipList && (
              // Popover seems to cause warning: findDOMNode is deprecated in StrictMode
              <Popover
                aria-label="Basic popover"
                bodyContent={MetricsPopoverContent(metricsTooltipList)}
                showClose={false}
                enableFlip={false}
                position="left-start"
              >
                <div className={`${styles['pnc-build-metrics-help']} ${styles['pnc-build-metrics-help--right']}`}>
                  <small>
                    Metrics Descriptions &nbsp;
                    <span className={styles['pnc-build-metric-info-icon']}>
                      <InfoCircleIcon />
                    </span>
                  </small>
                </div>
              </Popover>
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
        </div>
      </DataContainer>
    </>
  );
};
