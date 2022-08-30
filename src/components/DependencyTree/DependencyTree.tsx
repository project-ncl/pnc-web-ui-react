import { Button, Divider, TreeViewDataItem } from '@patternfly/react-core';
import { TreeView } from '@patternfly/react-core';
import { useCallback, useEffect, useState } from 'react';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';

import { buildService } from '../../services/buildService';
import { groupBuildService } from '../../services/groupBuildService';

import { isBuild } from '../../utils/entityRecognition';

import { BuildStatus } from '../BuildStatus/BuildStatus';
import styles from './DependencyTree.module.css';

interface IGraphEdge {
  source: string;
  target: string;
}

interface IGraphVertex {
  name: string;
  dataType: string;
  data: Build | GroupBuild;
  _dependencyBuildIds: Array<string>;
  _dependentBuildIds: Array<string>;
}

interface IDependencyTreeProps {
  build?: Build;
  groupBuild?: GroupBuild;
}

interface IServiceDataProps {
  build?: Build;
  groupBuild?: GroupBuild;
}

interface IDependencyBuild extends Build, GroupBuild {
  _buildIds?: Array<string>;
  _dependencyBuildIds?: Array<string>;
  _dependentBuildIds?: Array<string>;
}

interface IDependencyDataItem extends TreeViewDataItem {
  data: IDependencyBuild;
  children?: IDependencyDataItem[];
  level: number;
}

/**
 * Display a dependency tree for builds or group builds.
 *
 * @param build - The current build of the dependency tree
 * @param groupBuild - The current group build of the dependency tree
 *
 * @example
 * ```tsx
 * <DependencyTree build={buildObject}></DependencyTree>
 * `
 *
 */
export const DependencyTree = ({ build, groupBuild }: IDependencyTreeProps) => {
  const [display, setDisplay] = useState<boolean>(true);
  const [dependentStructure, setDependentStructure] = useState<Array<IDependencyDataItem>>();
  const [dependencyStructure, setDependencyStructure] = useState<IDependencyDataItem>();
  const [buildItem, setBuildItem] = useState<IDependencyBuild>();
  const [allExpanded, setAllExpanded] = useState<boolean | undefined>(undefined);
  const dataContainer = useDataContainer(
    useCallback(({ serviceData, requestConfig }: IService<IServiceDataProps>) => {
      if (serviceData!.build) {
        return buildService.getDependencyGraph({ id: serviceData!.build!.id }, requestConfig);
      } else {
        return groupBuildService.getDependencyGraph({ id: serviceData!.groupBuild!.id }, requestConfig);
      }
    }, [])
  );

  const refreshDataContainer = dataContainer.refresh;

  const refreshComponent = () => {
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 0);
  };

  const onClickExpandLevel1 = () => {
    setAllExpanded(undefined);
    setDefaultExpandByLevel(1, dependencyStructure!);
  };
  const onClickExpandLevel2 = () => {
    setAllExpanded(undefined);
    setDefaultExpandByLevel(2, dependencyStructure!);
  };
  const onClickExpandAll = () => {
    setAllExpanded(allExpanded !== undefined ? !allExpanded : true);
  };

  const onClickExpandAllFailed = () => {
    setAllExpanded(undefined);
    setExpandFailed(dependencyStructure!);
  };

  const setExpandFailed = (dependStructure: IDependencyDataItem) => {
    dependStructure.defaultExpanded = [
      'FAILED',
      'REJECTED',
      'REJECTED_FAILED_DEPENDENCIES',
      'SYSTEM_ERROR',
      'ENQUEUED',
      'WAITING_FOR_DEPENDENCIES',
      'BUILDING',
    ].includes(dependStructure.data.status!);
    dependStructure.children?.forEach((child) => setExpandFailed(child));
    dependStructure.level === 0 && refreshComponent();
  };

  const setDefaultExpandByLevel = (level: number, dependStructure: IDependencyDataItem) => {
    dependStructure.defaultExpanded = dependStructure.level < level;
    dependStructure.children?.forEach((child) => setDefaultExpandByLevel(level, child));
    dependStructure.level === 0 && refreshComponent();
  };

  const generateTreeItem = (build: IDependencyBuild) =>
    build && (
      <span className={styles['tree-item']}>
        <BuildStatus build={build} includeBuildLink includeConfigLink long />
      </span>
    );

  useEffect(() => {
    setBuildItem(build ? build : groupBuild);
    refreshDataContainer({ serviceData: { build: build, groupBuild: groupBuild } });
  }, [build, groupBuild, refreshDataContainer]);

  useEffect(() => {
    const getRootNodes = (edgesData: Array<IGraphEdge>, nodesData: Map<string, IDependencyBuild>) => {
      const rootNodes: Array<string> = [];
      nodesData.forEach((node) => {
        !edgesData.map((edge) => edge.target).includes(node.id) && rootNodes.push(node.id);
      });
      return rootNodes;
    };

    const attachChildFromEdges = (
      currentNode: IDependencyDataItem,
      edgesData: Array<IGraphEdge>,
      nodesData: Map<string, IDependencyBuild>,
      level: number = 1
    ) => {
      if (level === 1 && !isBuild(buildItem)) {
        const rootNodes: Array<string> = getRootNodes(edgesData, nodesData);
        const targetChildren = rootNodes.map((rootNode) => ({
          id: rootNode,
          name: generateTreeItem(nodesData?.get(rootNode)!),
          data: nodesData?.get(rootNode)!,
          defaultExpanded: false,
          level: level,
        }));
        if (currentNode.children) {
          currentNode.children.concat(targetChildren);
        } else {
          currentNode.children = targetChildren;
        }
      } else {
        edgesData!
          .filter((edge) => edge.source === currentNode.id)
          .forEach((edge) => {
            const targetChild = {
              id: edge.target,
              name: generateTreeItem(nodesData?.get(edge.target)!),
              data: nodesData?.get(edge.target)!,
              defaultExpanded: false,
              level: level,
            };
            if (currentNode.children) {
              currentNode.children.push(targetChild);
            } else {
              currentNode.children = [targetChild];
            }
          });
      }
      currentNode.children?.forEach((child) => attachChildFromEdges(child, edgesData, nodesData, level + 1));
      return currentNode;
    };
    if (!dataContainer.data) {
      return;
    }
    const nodesData: Map<string, IDependencyBuild> = new Map();
    const verticesData = new Map<string, IGraphVertex>(Object.entries(dataContainer.data.vertices));
    verticesData.forEach((vertex: IGraphVertex) => {
      nodesData.set(vertex.name, vertex.data);
    });

    const _dependencyStructure: IDependencyDataItem = {
      id: buildItem?.id,
      name: generateTreeItem(buildItem!),
      data: buildItem!,
      defaultExpanded: true,
      level: 0,
    };
    const _dependentStructure: Array<IDependencyDataItem> = [];

    const edgesData: Array<IGraphEdge> = [];
    Object.assign(edgesData, dataContainer.data.edges);

    // Generate parent dependents
    edgesData
      .filter((edge) => edge.target === buildItem!.id)
      .forEach((edge) => {
        _dependentStructure.push({
          data: nodesData.get(edge.source)!,
          id: edge.target,
          name: generateTreeItem(nodesData.get(edge.source)!),
          defaultExpanded: false,
          level: 0,
        });
      });
    setDependentStructure(_dependentStructure);

    // Generate children dependency
    setDependencyStructure(attachChildFromEdges(_dependencyStructure, edgesData, nodesData, 1));
  }, [dataContainer.data, buildItem]);

  return (
    <>
      <DataContainer {...dataContainer} title="Dependency Tree">
        {buildItem && isBuild(buildItem) && (
          <>
            <div className={styles['build-tree-component']}>
              <div className={styles['sub-title-bar']}>
                <strong>Direct Parents</strong>
              </div>
              {dependentStructure?.length ? (
                <TreeView data={dependentStructure} allExpanded={allExpanded} hasGuides={true} />
              ) : (
                <div className={styles['no-data-text']}>No direct parent</div>
              )}
            </div>
            <Divider />
          </>
        )}
        <div className={styles['build-tree-component']}>
          <div className={styles['sub-title-bar']}>
            <strong>Dependencies</strong>
            <Button variant="tertiary" onClick={onClickExpandLevel1} isSmall>
              Expand 1 Level
            </Button>
            <Button variant="tertiary" onClick={onClickExpandLevel2} isSmall>
              Expand 2 Levels
            </Button>
            <Button variant="tertiary" onClick={onClickExpandAll} isSmall>
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button variant="tertiary" onClick={onClickExpandAllFailed} isSmall>
              Expand All Failed
            </Button>
          </div>
          {display && dependencyStructure && <TreeView data={[dependencyStructure]} allExpanded={allExpanded} hasGuides={true} />}
        </div>
      </DataContainer>
    </>
  );
};
