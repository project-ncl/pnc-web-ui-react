import Graph from 'graphology';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import circular from 'graphology-layout/circular';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Sigma from 'sigma';
import { PlainObject } from 'sigma/types';

import { drawHover, drawLabel } from 'libs/sigmaJsCanvasRenderer';

import { getCssColorValue } from 'utils/utils';

export const NODE_COLOR = '--c--graph--node';
export const MAIN_NODE_COLOR = '--c--graph--node--main';
export const EDGE_COLOR = '--c--graph--edge';
export const LABEL_COLOR = '--c--graph--label';
export const SELECTED_COLOR = '--c--graph--highlighted';
export const SEARCH_HIGHLIGHT_COLOR = '--c--graph--highlighted';
export const SUBTLE_COLOR = '--c--graph--subtle';

interface IGraphSearchNode {
  name: string;
  depthLimit: number;
}

type OnGraphCreatedFunction = (graph: Graph, renderer: Sigma) => void;

interface IUseNetworkGraphProps {
  sigmaContainerId?: string;
  mainNode: string;
  hasLimitedNesting: boolean;
  nestingLevel: number;
  searchValueMainLabel?: string;
  searchValueSubLabel?: string;
  onEdgeSelected?: (node1: any, node2: any) => void;
}

/**
 * Hook for creating and managing network graph.
 * Implemented with use of Sigma.js and Graphology.
 *
 * @param sigmaContainerId - Div in which Sigma.js graph will be rendered in.
 * @param mainNode - Name of the main node of the graph.
 * @param hasLimitedNesting - Whether is nesting level limitted. Relative to the main node.
 * @param nestingLevel - Nesting level. 1 = maximally, neighbors of the main node are displayed, etc.
 * @param searchValueMainLabel - Search value for nodes' main label. Used for node highlighting.
 * @param searchValueSubLabel - Search value for nodes' sublabel. Used for node highlighting.
 * @param onEdgeSelected - Callback to be executed when edge is selected.
 *
 * @returns form states and access functions
 *  -> createNetworkGraph - Create new Sigma.js / Graphology graph.
 *  -> selectEdge         - Select edge connecting two milestones.
 *  -> isLayoutRunning    - Whether the graph layout algorithm is running.
 *  -> layoutStart        - Start the graph layout algorithm.
 *  -> layoutStop         - Stop the graph layout algorithm.
 *  -> selectedNodesCount - Number of selected nodes.
 *  -> unselectAllNodes   - Unselect all nodes in the graph.
 */
export const useNetworkGraph = ({
  sigmaContainerId = 'sigma-container',
  mainNode,
  hasLimitedNesting,
  nestingLevel,
  searchValueMainLabel,
  searchValueSubLabel,
  onEdgeSelected,
}: IUseNetworkGraphProps) => {
  const graph = useRef<Graph>();
  const renderer = useRef<Sigma>();
  const layout = useRef<FA2Layout>();

  const [isGraphRendered, setIsGraphRendered] = useState<boolean>(false);
  const [isLayoutRunning, setIsLayoutRunning] = useState<boolean>(false);

  const [hoveredNode, setHoveredNode] = useState<string>();
  const [draggedNode, setDraggedNode] = useState<string>();
  const draggedNodeRef = useRef<string>();
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string>();
  const selectedEdgeRef = useRef<string>();

  const navigate = useNavigate();

  const selectEdge = (milestone1?: string, milestone2?: string) => {
    if (milestone1 && milestone2) {
      setSelectedEdge(graph?.current?.edge(milestone1, milestone2));
    } else {
      setSelectedEdge(undefined);
    }
  };

  const createNetworkGraph = (onGraphCreated: OnGraphCreatedFunction) => {
    const sigmaContainer = document.getElementById(sigmaContainerId);

    if (sigmaContainer) {
      graph.current = new Graph();

      renderer.current = new Sigma(graph.current, sigmaContainer, {
        minCameraRatio: 0.01,
        maxCameraRatio: 10,
        renderEdgeLabels: true,
        enableEdgeEvents: true,
        allowInvalidContainer: true,
        defaultDrawNodeLabel: drawLabel,
        edgeLabelColor: {
          color: getCssColorValue(LABEL_COLOR),
        },
      });

      renderer.current.setSetting(
        'defaultDrawNodeHover',
        (context: CanvasRenderingContext2D, data: PlainObject, settings: PlainObject) =>
          drawHover(context, { ...renderer.current?.getNodeDisplayData(data.key), ...data }, settings)
      );

      renderer.current.setSetting('labelRenderedSizeThreshold', 1);

      // EVENT HANDLERS

      renderer.current.on('enterNode', ({ node }) => {
        setHoveredNode(node);
        sigmaContainer.style.cursor = 'pointer';
      });

      renderer.current.on('leaveNode', () => {
        setHoveredNode(undefined);
        sigmaContainer.style.cursor = 'default';
      });

      renderer.current.on('clickNode', ({ node, event }) => {
        if (event.original.shiftKey) return;

        setSelectedNodes((nodes) => {
          const otherNodes = nodes.filter((n) => n !== node);
          return nodes.includes(node) ? otherNodes : [...nodes, node];
        });
      });

      renderer.current.on('downNode', ({ node, event }) => {
        if (!event.original.shiftKey) return;

        setDraggedNode(node);
        draggedNodeRef.current = node;
      });

      renderer.current.on('doubleClickNode', ({ node }) => {
        navigate(graph.current?.getNodeAttributes(node)?.link);
      });

      renderer.current.on('enterEdge', () => {
        sigmaContainer.style.cursor = 'pointer';
      });

      renderer.current.on('leaveEdge', () => {
        sigmaContainer.style.cursor = 'default';
      });

      renderer.current.getMouseCaptor().on('mouseup', () => {
        setDraggedNode(undefined);
        draggedNodeRef.current = undefined;
      });

      // this handler was taken from:
      // https://codesandbox.io/s/github/jacomyal/sigma.js/tree/main/examples/mouse-manipulations?file=/index.ts
      renderer.current.getMouseCaptor().on('mousemovebody', (e) => {
        if (!draggedNodeRef.current) return;

        const pos = renderer.current!.viewportToGraph(e);
        graph.current?.setNodeAttribute(draggedNodeRef.current, 'x', pos.x);
        graph.current?.setNodeAttribute(draggedNodeRef.current, 'y', pos.y);

        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      });

      // ON GRAPH CREATED

      onGraphCreated(graph.current, renderer.current);

      circular.assign(graph.current);
      layout.current = new FA2Layout(graph.current, {
        settings: {
          strongGravityMode: true,
          gravity: 0.01,
          linLogMode: true,
          scalingRatio: 10,
        },
      });

      layoutStart();
      setTimeout(() => layoutStop(), 1000);

      setIsGraphRendered(true);
    }

    return () => {
      layoutStop();
      setIsGraphRendered(false);
      setHoveredNode(undefined);
      setDraggedNode(undefined);
      draggedNodeRef.current = undefined;
      setSelectedNodes([]);
      setSelectedEdge(undefined);
      selectedEdgeRef.current = undefined;
      layout.current?.kill?.();
      renderer.current?.kill();
      graph.current?.clear();
      layout.current = undefined;
      renderer.current = undefined;
      graph.current = undefined;
    };
  };

  const layoutStart = () => {
    layout.current?.start();
    setIsLayoutRunning(true);
  };

  const layoutStop = () => {
    layout.current?.stop();
    setIsLayoutRunning(false);
  };

  // DYNAMIC EVENT HANDLERS

  useEffect(() => {
    renderer.current?.on('clickEdge', ({ edge, event }) => {
      if (event.original.shiftKey) return;

      const isCurrentEdge = selectedEdgeRef.current === edge;
      setSelectedEdge(isCurrentEdge ? undefined : edge);
      selectedEdgeRef.current = isCurrentEdge ? undefined : edge;

      if (onEdgeSelected) {
        if (isCurrentEdge) {
          onEdgeSelected(undefined, undefined);
        } else {
          const node1 = graph.current?.getNodeAttributes(graph.current?.source(edge));
          const node2 = graph.current?.getNodeAttributes(graph.current?.target(edge));
          onEdgeSelected(node1, node2);
        }
      }
    });
  }, [isGraphRendered, onEdgeSelected]);

  // GRAPH SEARCH

  useEffect(() => {
    // BFS graph search algorithm
    if (graph.current?.hasNode(mainNode)) {
      const open: IGraphSearchNode[] = [{ name: mainNode, depthLimit: nestingLevel }];
      const closed: IGraphSearchNode[] = [];

      while (open.length) {
        const firstNode = open.shift() as IGraphSearchNode;
        closed.push(firstNode);

        graph.current.setNodeAttribute(firstNode.name, 'hidden', hasLimitedNesting && firstNode.depthLimit <= -1);

        graph.current.forEachNeighbor(firstNode.name, (ngh: string) => {
          if (
            !closed.map((node: IGraphSearchNode) => node.name).includes(ngh) &&
            !open.map((node: IGraphSearchNode) => node.name).includes(ngh)
          ) {
            open.push({ name: ngh, depthLimit: firstNode.depthLimit - 1 });
          }
        });
      }
    }
  }, [isGraphRendered, mainNode, hasLimitedNesting, nestingLevel]);

  // GRAPH REDUCERS

  useEffect(() => {
    renderer.current?.setSetting('nodeReducer', (node: string, data: any) => {
      const nodeAttribute = graph.current?.getNodeAttributes(node);

      const doesLabelMatch =
        searchValueMainLabel && nodeAttribute?.mainLabel?.toLowerCase().includes(searchValueMainLabel.toLowerCase());
      const doesSubLabelMatch =
        searchValueSubLabel && nodeAttribute?.subLabel?.toLowerCase().includes(searchValueSubLabel.toLowerCase());
      if (
        (searchValueMainLabel && searchValueSubLabel && doesLabelMatch && doesSubLabelMatch) ||
        (searchValueMainLabel && !searchValueSubLabel && doesLabelMatch) ||
        (!searchValueMainLabel && searchValueSubLabel && doesSubLabelMatch)
      ) {
        return { ...data, highlighted: true, label: '', color: getCssColorValue(SEARCH_HIGHLIGHT_COLOR) };
      }

      if (hoveredNode || draggedNode || selectedNodes.length) {
        const newData = {
          ...data,
          ...(node === hoveredNode || node === draggedNode ? { highlighted: true, label: '' } : {}),
          ...(selectedNodes.includes(node) ? { color: getCssColorValue(SELECTED_COLOR) } : {}),
        };

        if (
          draggedNode &&
          (node === draggedNode || graph.current?.hasEdge(node, draggedNode) || graph.current?.hasEdge(draggedNode, node))
        ) {
          return newData;
        }

        if (
          hoveredNode &&
          !draggedNode &&
          (node === hoveredNode || graph.current?.hasEdge(node, hoveredNode) || graph.current?.hasEdge(hoveredNode, node))
        ) {
          return newData;
        }

        if (
          selectedNodes.length &&
          (selectedNodes.includes(node) ||
            selectedNodes.some((n) => graph.current?.hasEdge(node, n) || graph.current?.hasEdge(n, node)))
        ) {
          return newData;
        }

        return { ...data, highlighted: false, label: '', color: getCssColorValue(SUBTLE_COLOR) };
      }

      return data;
    });

    renderer.current?.setSetting('edgeReducer', (edge: string, data: any) => {
      if (hoveredNode || draggedNode || selectedNodes.length || selectedEdge) {
        const newData = {
          ...data,
          ...(edge === selectedEdge ? { color: getCssColorValue(SELECTED_COLOR) } : {}),
        };

        if (draggedNode && graph.current?.hasExtremity(edge, draggedNode)) {
          return newData;
        }

        if (hoveredNode && !draggedNode && graph.current?.hasExtremity(edge, hoveredNode)) {
          return newData;
        }

        if (selectedNodes.length && selectedNodes.some((n) => graph.current?.hasExtremity(edge, n))) {
          return newData;
        }

        if (edge === selectedEdge) {
          return newData;
        }

        return { ...newData, label: '', color: getCssColorValue(SUBTLE_COLOR) };
      }

      return data;
    });
  }, [isGraphRendered, hoveredNode, draggedNode, selectedNodes, selectedEdge, searchValueMainLabel, searchValueSubLabel]);

  return {
    createNetworkGraph: useCallback(createNetworkGraph, [sigmaContainerId, navigate]),
    selectEdge: useCallback(selectEdge, []),
    isLayoutRunning,
    layoutStart,
    layoutStop,
    selectedNodesCount: selectedNodes.length,
    unselectAllNodes: () => setSelectedNodes([]),
  };
};
