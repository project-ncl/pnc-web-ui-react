import Graph from 'graphology';
import { useCallback, useEffect } from 'react';

import { EDGE_COLOR, MAIN_NODE_COLOR, NODE_COLOR, useNetworkGraph } from 'hooks/useNetworkGraph';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';

import { calculateBuildConfigName, calculateBuildName, calculateLongBuildName } from 'components/BuildName/BuildName';
import { LayoutControlButton } from 'components/NetworkGraphs/LayoutControlButton';
import { SelectedNodesInfo } from 'components/NetworkGraphs/SelectedNodesInfo';

import styles from './NetworkGraph.module.css';

interface IBuildArtifactDependencyGraphProps {
  data: any;
  mainNode: string;
  hasLimitedNesting: boolean;
  nestingLevel: number;
  searchValueMainLabel?: string;
  searchValueSubLabel?: string;
  onEdgeSelected?: (dependentBuild: any, dependencyBuild: any) => void;
  componentId: string;
}

/**
 * Build Artifact Dependency Graph pointing Builds to their Artifact (build-time) dependencies.
 *
 * @param data - Graph data.
 * @param mainNode - Name of the main node of the graph.
 * @param hasLimitedNesting - Whether is nesting level limitted. Relative to the main node.
 * @param nestingLevel - Nesting level. 1 = maximally, neighbors of the main node are displayed, etc.
 * @param searchValueMainLabel - Search value for nodes' main label. Used for node highlighting.
 * @param searchValueSubLabel - Search value for nodes' sublabel. Used for node highlighting.
 * @param onEdgeSelected - Callback to be executed when edge is selected.
 * @param componentId - Component ID of Artifact dependencies list.
 */
export const BuildArtifactDependencyGraph = ({
  data,
  mainNode,
  hasLimitedNesting,
  nestingLevel,
  searchValueMainLabel,
  searchValueSubLabel,
  onEdgeSelected,
  componentId,
}: IBuildArtifactDependencyGraphProps) => {
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
      createNetworkGraph((graph: Graph) => {
        Object.values(data.vertices).forEach((node: any) => {
          graph.addNode(node.name, {
            id: node.data.id,
            label: calculateLongBuildName(node.data),
            mainLabel: calculateBuildName(node.data),
            subLabel: calculateBuildConfigName(node.data),
            link: `/builds/${node.data.id}`,
            size: node.data.id === mainNode ? 9 : 6,
            color: node.data.id === mainNode ? MAIN_NODE_COLOR : NODE_COLOR,
            x: 0,
            y: 0,
          });
        });

        data.edges.forEach((edge: any) => {
          graph.addEdge(edge.source, edge.target, {
            label: edge.artifactDependencies,
            size: 5,
            color: EDGE_COLOR,
            type: 'arrow',
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
            data.vertices[requestConfig.params.dependentBuild]?.name,
            data.vertices[requestConfig.params.dependencyBuild]?.name
          );
        } else {
          selectEdge(undefined);
        }
      },
      [selectEdge, data.vertices]
    ),
    { componentId, mandatoryQueryParams: { pagination: false, sorting: false } }
  );

  return (
    <div id="sigma-container" className={styles['sigma-container']}>
      {!!selectedNodesCount && <SelectedNodesInfo selectedNodesCount={selectedNodesCount} unselectAllNodes={unselectAllNodes} />}
      <LayoutControlButton isLayoutRunning={isLayoutRunning} layoutStart={layoutStart} layoutStop={layoutStop} />
    </div>
  );
};
