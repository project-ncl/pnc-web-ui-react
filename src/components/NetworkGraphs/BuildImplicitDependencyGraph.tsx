import Graph from 'graphology';
import { useCallback, useEffect } from 'react';

import { Build, BuildsGraph } from 'pnc-api-types-ts';

import { EDGE_COLOR, MAIN_NODE_COLOR, NODE_COLOR, useNetworkGraph } from 'hooks/useNetworkGraph';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';

import { calculateBuildConfigName, calculateBuildName, calculateLongBuildName } from 'components/BuildName/BuildName';
import { LayoutControlButton } from 'components/NetworkGraphs/LayoutControlButton';
import { SelectedNodesInfo } from 'components/NetworkGraphs/SelectedNodesInfo';

import styles from './NetworkGraph.module.css';

interface IBuildImplicitDependencyGraphProps {
  data: BuildsGraph;
  mainNode: string;
  hasLimitedNesting: boolean;
  nestingLevel: number;
  searchValueMainLabel?: string;
  searchValueSubLabel?: string;
  onEdgeSelected?: (dependentBuild: Build, dependencyBuild: Build) => void;
  componentId: string;
}

/**
 * Build Implicit Dependency Graph pointing Builds to Builds producing their Artifact (build-time) dependencies.
 *
 * @param data - Graph data.
 * @param mainNode - Name of the main node of the graph.
 * @param hasLimitedNesting - Whether is nesting level limited. Relative to the main node.
 * @param nestingLevel - Nesting level. 1 = maximally, neighbors of the main node are displayed, etc.
 * @param searchValueMainLabel - Search value for nodes' main label. Used for node highlighting.
 * @param searchValueSubLabel - Search value for nodes' sublabel. Used for node highlighting.
 * @param onEdgeSelected - Callback to be executed when edge is selected.
 * @param componentId - Component ID of implicit dependencies list.
 */
export const BuildImplicitDependencyGraph = ({
  data,
  mainNode,
  hasLimitedNesting,
  nestingLevel,
  searchValueMainLabel,
  searchValueSubLabel,
  onEdgeSelected,
  componentId,
}: IBuildImplicitDependencyGraphProps) => {
  const { createNetworkGraph, selectEdge, isLayoutRunning, layoutStart, layoutStop, selectedNodesCount, unselectAllNodes } =
    useNetworkGraph({
      mainNode,
      hasLimitedNesting,
      nestingLevel,
      searchValueMainLabel,
      searchValueSubLabel,
      onEdgeSelected,
    });

  useEffect(() => {
    if (data) {
      // defer graph rendering until after the UI paint; there were issues with useEffect double-invocation
      requestAnimationFrame(() => {
        createNetworkGraph((graph: Graph) => {
          Object.values(data.vertices!).forEach((node) => {
            graph.addNode(node.name, {
              id: node.name,
              label: calculateLongBuildName(node.data!),
              mainLabel: calculateBuildName(node.data!),
              subLabel: calculateBuildConfigName(node.data!),
              link: `/builds/${node.data!.id}`,
              size: node.name === mainNode ? 9 : 6,
              color: node.name === mainNode ? MAIN_NODE_COLOR : NODE_COLOR,
              x: 0,
              y: 0,
            });
          });

          data.edges!.forEach((edge) => {
            graph.addEdge(edge.source, edge.target, {
              label: edge.cost,
              size: 5,
              color: EDGE_COLOR,
              type: 'arrow',
            });
          });
        });
      });
    }
  }, [data, mainNode, createNetworkGraph]);

  // must be below createNetworkGraph useEffect
  // URL -> UI (select graph edge)
  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => {
        if (requestConfig?.params.dependentBuild && requestConfig?.params.dependencyBuild) {
          selectEdge(
            data.vertices![requestConfig.params.dependentBuild]?.name,
            data.vertices![requestConfig.params.dependencyBuild]?.name
          );
        } else {
          selectEdge(undefined);
        }
      },
      [selectEdge, data.vertices]
    ),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.none }
  );

  return (
    <div id="sigma-container" className={styles['sigma-container']}>
      {!!selectedNodesCount && <SelectedNodesInfo selectedNodesCount={selectedNodesCount} unselectAllNodes={unselectAllNodes} />}
      <LayoutControlButton isLayoutRunning={isLayoutRunning} layoutStart={layoutStart} layoutStop={layoutStop} />
    </div>
  );
};
