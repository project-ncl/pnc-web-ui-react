import { Button, Divider, TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useEffect, useState } from 'react';

import { Build, BuildsGraph, GroupBuild } from 'pnc-api-types-ts';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { BuildStatus } from 'components/BuildStatus/BuildStatus';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import { isBuild, isGroupBuild } from 'utils/entityRecognition';
import { getNumberGenerator } from 'utils/utils';

import styles from './DependencyTree.module.css';
import './TreeView.css';

const FAILED_BUILD_STATUSES = [
  'FAILED',
  'CANCELLED',
  'REJECTED',
  'REJECTED_FAILED_DEPENDENCIES',
  'SYSTEM_ERROR',
  'ENQUEUED',
  'WAITING_FOR_DEPENDENCIES',
  'BUILDING',
];

interface IDependencyDataItem<T extends Build | GroupBuild> extends TreeViewDataItem {
  data: T;
  level: number;
  children?: IDependencyDataItem<T>[];
}

interface IDependencyTreeProps<T extends Build | GroupBuild> {
  serviceContainerDependencyGraph: IServiceContainerState<BuildsGraph>;
  rootBuild: T;
}

/**
 * Displays a dependency tree for a Build or a Group Build.
 *
 * @param serviceContainerDependencyGraph - Service container for the dependency tree
 * @param rootBuild - The root Build / Group Build of the dependency tree
 */
export const DependencyTree = <T extends Build | GroupBuild>({
  serviceContainerDependencyGraph,
  rootBuild,
}: IDependencyTreeProps<T>) => {
  const [buildDependencies, setBuildDependencies] = useState<IDependencyDataItem<T>>();
  const [buildDirectParents, setBuildDirectParents] = useState<IDependencyDataItem<T>[]>();

  const [areAllBuildDependenciesExpanded, setAreAllBuildDependenciesExpanded] = useState<boolean | undefined>(undefined);

  const refreshTreeExpanding = () => {
    setAreAllBuildDependenciesExpanded(false);
    setTimeout(() => {
      setAreAllBuildDependenciesExpanded(undefined);
    }, 0);
  };

  // 'defaultExpanded' is not official way to set the expand level, but there seems to be no other way
  const setBuildDependenciesExpandedByLevel = (level: number) => {
    const getExpandedGraph = (node: IDependencyDataItem<T>, level: number): IDependencyDataItem<T> => {
      const newChildrenNodes = node?.children?.map((childNode) => getExpandedGraph(childNode, level));
      return { ...node, defaultExpanded: node.level < level, children: newChildrenNodes };
    };

    refreshTreeExpanding();
    setBuildDependencies((buildDependencies) => buildDependencies && getExpandedGraph(buildDependencies, level));
  };

  const setBuildDependenciesWithErrorExpanded = () => {
    const getExpandedGraph = (node: IDependencyDataItem<T>): IDependencyDataItem<T> => {
      const newChildrenNodes = node?.children?.map((childNode) => getExpandedGraph(childNode));
      return { ...node, defaultExpanded: FAILED_BUILD_STATUSES.includes(node.data.status!), children: newChildrenNodes };
    };

    refreshTreeExpanding();
    setBuildDependencies((buildDependencies) => buildDependencies && getExpandedGraph(buildDependencies));
  };

  useEffect(() => {
    if (!serviceContainerDependencyGraph.data) {
      return;
    }

    setBuildDependencies(generateDependencyGraph(serviceContainerDependencyGraph.data, rootBuild));
    setBuildDirectParents(generateDirectParents(serviceContainerDependencyGraph.data, rootBuild));
  }, [serviceContainerDependencyGraph.data, rootBuild]);

  return (
    <ServiceContainerLoading {...serviceContainerDependencyGraph} title="Dependency Tree">
      {isBuild(rootBuild) && (
        <>
          <div className="m-b-20">
            <div className={styles['sub-title-bar']}>
              <strong>Direct Parents</strong>
            </div>
            {buildDirectParents?.length ? (
              <TreeView data={buildDirectParents} hasGuides />
            ) : (
              <div className={styles['no-data-text']}>No direct parent</div>
            )}
          </div>
          <Divider />
        </>
      )}
      <div className={css(isBuild(rootBuild) && 'm-t-20')}>
        <div className={styles['sub-title-bar']}>
          <strong>Dependencies</strong>
          <Button variant="tertiary" onClick={() => setBuildDependenciesExpandedByLevel(1)} isSmall>
            Expand 1 Level
          </Button>
          <Button variant="tertiary" onClick={() => setBuildDependenciesExpandedByLevel(2)} isSmall>
            Expand 2 Levels
          </Button>
          <Button
            variant="tertiary"
            onClick={() =>
              setAreAllBuildDependenciesExpanded(
                areAllBuildDependenciesExpanded !== undefined ? !areAllBuildDependenciesExpanded : true
              )
            }
            isSmall
          >
            {areAllBuildDependenciesExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
          <Button variant="tertiary" onClick={() => setBuildDependenciesWithErrorExpanded()} isSmall>
            Expand All Failed
          </Button>
        </div>
        {buildDependencies && <TreeView data={[buildDependencies]} allExpanded={areAllBuildDependenciesExpanded} hasGuides />}
      </div>
    </ServiceContainerLoading>
  );
};

const generateTreeItem = <T extends Build | GroupBuild>(build: T) =>
  build && (
    <span className={styles['tree-item']}>
      <BuildStatus build={build} includeBuildLink includeConfigLink long />
    </span>
  );

const generateDependencyGraph = <T extends Build | GroupBuild>(graph: BuildsGraph, rootBuild: T): IDependencyDataItem<T> => {
  const idGenerator = getNumberGenerator();
  const getNextId = () => idGenerator.next().value;

  const edgeTargets = graph.edges!.map((edge) => edge.target);

  const generateDependencyGraphNode = <T extends Build | GroupBuild>(
    graph: BuildsGraph,
    build: T,
    level = 0
  ): IDependencyDataItem<T> => {
    const vertexChildren =
      isGroupBuild(build) && level === 0
        ? Object.values(graph.vertices!)
            .filter((node) => !edgeTargets.includes(node.data!.id))
            .map((node) => node.data as T)
        : graph.edges!.filter((edge) => edge.source === build.id).map((edge) => graph.vertices![edge.target!].data as T);
    const nodeChildren = vertexChildren.length
      ? vertexChildren.map((node) => generateDependencyGraphNode(graph, node, level + 1))
      : undefined;

    return {
      id: `${getNextId()}`,
      name: generateTreeItem(build),
      data: build,
      level,
      defaultExpanded: level === 0,
      children: nodeChildren,
    };
  };

  return generateDependencyGraphNode(graph, rootBuild);
};

const generateDirectParents = <T extends Build | GroupBuild>(graph: BuildsGraph, rootBuild: T): IDependencyDataItem<T>[] => {
  const idGenerator = getNumberGenerator();
  const getNextId = () => idGenerator.next().value;

  const generateDirectParentNodes = <T extends Build | GroupBuild>(graph: BuildsGraph, build: T): IDependencyDataItem<T>[] => {
    return graph
      .edges!.filter((edge) => edge.target === build.id)
      .map((edge) => {
        const node = graph.vertices![edge.source!].data as T;
        return {
          id: `${getNextId()}`,
          name: generateTreeItem(node),
          data: node,
          level: 0,
          defaultExpanded: false,
        };
      });
  };

  return generateDirectParentNodes(graph, rootBuild);
};
