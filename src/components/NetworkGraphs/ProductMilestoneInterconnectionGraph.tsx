import Graph from 'graphology';
import { useCallback, useEffect } from 'react';

import { EDGE_COLOR, MAIN_NODE_COLOR, NODE_COLOR, useNetworkGraph } from 'hooks/useNetworkGraph';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';

import { LayoutControlButton } from 'components/NetworkGraphs/LayoutControlButton';
import { SelectedNodesInfo } from 'components/NetworkGraphs/SelectedNodesInfo';

import styles from './NetworkGraph.module.css';

interface IProductMilestoneInterconnectionGraphProps {
  data: any;
  mainNode: string;
  hasLimitedNesting: boolean;
  nestingLevel: number;
  searchValueMainLabel?: string;
  searchValueSubLabel?: string;
  onEdgeSelected: (milestone1: any, milestone2: any) => void;
  componentId: string;
}

/**
 * Product Milestone Interconnection graph connecting Product Milestones sharing Delivered Artifacts.
 *
 * @param data - Graph data.
 * @param mainNode - Name of the main node of the graph.
 * @param hasLimitedNesting - Whether is nesting level limitted. Relative to the main node.
 * @param nestingLevel - Nesting level. 1 = maximally, neighbors of the main node are displayed, etc.
 * @param searchValueMainLabel - Search value for nodes' main label. Used for node highlighting.
 * @param searchValueSubLabel - Search value for nodes' sublabel. Used for node highlighting.
 * @param onEdgeSelected - Callback to be executed when edge is selected.
 * @param componentId - Component ID of shared Delivered Artifacts list.
 */
export const ProductMilestoneInterconnectionGraph = ({
  data,
  mainNode,
  hasLimitedNesting,
  nestingLevel,
  searchValueMainLabel,
  searchValueSubLabel,
  onEdgeSelected,
  componentId,
}: IProductMilestoneInterconnectionGraphProps) => {
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
            label: `${node.data.product.name} ${node.name}`,
            mainLabel: node.name,
            subLabel: node.data.product.name,
            link: `/products/${node.data.product.id}/versions/${node.data.productVersion.id}/milestones/${node.data.id}`,
            size: node.data.version === mainNode ? 9 : 6,
            color: node.data.version === mainNode ? MAIN_NODE_COLOR : NODE_COLOR,
            x: 0,
            y: 0,
          });
        });

        data.edges.forEach((edge: any) => {
          graph.addEdge(edge.source, edge.target, {
            label: edge.sharedDeliveredArtifacts,
            size: 3,
            color: EDGE_COLOR,
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
        if (requestConfig?.params.milestone1 && requestConfig?.params.milestone2) {
          selectEdge(data.vertices[requestConfig.params.milestone1]?.name, data.vertices[requestConfig.params.milestone2]?.name);
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
