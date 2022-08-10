import { Button, Divider, TreeViewDataItem } from '@patternfly/react-core';
import { TreeView } from '@patternfly/react-core';
import { Build, GroupBuild } from 'pnc-api-types-ts';
import { useState, useEffect } from 'react';
import { DataContainer } from '../../containers/DataContainer/DataContainer';
import { IService, useDataContainer } from '../../containers/DataContainer/useDataContainer';
import { buildService } from '../../services/buildService';
import { groupBuildService } from '../../services/groupBuildService';
import { BuildName } from '../BuildName/BuildName';
import { BuildStatusIcon } from '../BuildStatusIcon/BuildStatusIcon';
import { isBuild } from '../../utils/entityRecognition';
import styles from './DependencyTree.module.css';

export interface IGraphEdge {
  source: string;
  target: string;
}

export interface IGraphVertic {
  name: string;
  dataType: string;
  data: Build | GroupBuild;
  _dependencyBuildIds: Array<string>;
  _dependentBuildIds: Array<string>;
}

export interface IDependencyGraph {
  edges: Array<IGraphEdge>;
  vertices: Map<string, IGraphVertic>;
}

export interface IDependencyTreeProps {
  build?: Build;
  groupBuild?: GroupBuild;
  dependencyGraph?: IDependencyGraph;
}

export interface IServiceDataProps {
  build?: Build;
  groupBuild?: GroupBuild;
}

export interface IDependencyBuild extends Build, GroupBuild {
  _buildIds?: Array<string>;
  _dependencyBuildIds?: Array<string>;
  _dependentBuildIds?: Array<string>;
}

export interface IDependencyDataItem extends TreeViewDataItem {
  data: IDependencyBuild;
  children?: IDependencyDataItem[];
  level: number;
}

/**
 * Display a dependency tree for builds or group builds.
 *
 * @param build - The current build of the dependency tree
 */
export const DependencyTree = ({ build, groupBuild, dependencyGraph }: IDependencyTreeProps) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [dependentStructure, setDependentStructure] = useState<Array<IDependencyDataItem>>();
  const [dependencyStructure, setDependencyStructure] = useState<IDependencyDataItem>();
  const [buildItem, setBuildItem] = useState<IDependencyBuild>();
  const [allExpanded, setAllExpanded] = useState<boolean | undefined>(undefined);
  const dataContainer = useDataContainer(({ serviceData, requestConfig }: IService<IServiceDataProps>) => {
    if (serviceData!.build) {
      return buildService.getDependencyGraph(serviceData!.build!.id, requestConfig);
    } else {
      return groupBuildService.getDependencyGraph(serviceData!.groupBuild!.id, requestConfig);
    }
  });

  const refreshComponent = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
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
    dependStructure.defaultExpanded = ['FAILED', 'REJECTED', 'REJECTED_FAILED_DEPENDENCIES', 'SYSTEM_ERROR'].includes(
      dependStructure.data.status!
    );
    dependStructure.children?.forEach((child) => setExpandFailed(child));
    console.log(dependStructure);
    if (dependStructure.level === 0) {
      refreshComponent();
    }
  };

  const setDefaultExpandByLevel = (level: number, dependStructure: IDependencyDataItem) => {
    dependStructure.defaultExpanded = dependStructure.level < level;
    dependStructure.children?.forEach((child) => setDefaultExpandByLevel(level, child));
    if (dependStructure.level === 0) {
      refreshComponent();
    }
  };

  const treeItem = (build: IDependencyBuild) =>
    build && (
      <span className={styles['tree-item']}>
        <BuildStatusIcon build={build} />
        {isBuild(build) && <BuildName build={build} long includeBuildLink includeConfigLink />}
        {/* Todo: Finish group build name component */}
        {!isBuild(build) && (
          <span>
            <span>#{build.id}</span> of <span>{build.groupConfig?.name}</span>
          </span>
        )}
      </span>
    );

  useEffect(() => {
    setBuildItem(build ? build : groupBuild);
    dataContainer.refresh({ serviceData: { build: build, groupBuild: groupBuild } });
  }, [build, groupBuild]);

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
      level: number
    ) => {
      level = level ? level : 1;
      if (level === 1 && !isBuild(buildItem)) {
        const rootNodes: Array<string> = level === 1 ? getRootNodes(edgesData, nodesData) : [];
        const targetChildren = rootNodes.map((rootNode) => ({
          id: rootNode,
          name: treeItem(nodesData?.get(rootNode)!),
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
          .filter((edge) => (level === 1 && !isBuild(buildItem)) || edge.source === currentNode.id)
          .forEach((edge) => {
            const targetChild = {
              id: edge.target,
              name: treeItem(nodesData?.get(edge.target)!),
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
    const verticesData = new Map<string, IGraphVertic>(Object.entries(dataContainer.data.vertices));
    verticesData.forEach((vertex: IGraphVertic) => {
      nodesData.set(vertex.name, vertex.data);
    });

    const _dependencyStructure: IDependencyDataItem = {
      id: buildItem?.id,
      name: treeItem(buildItem!),
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
          name: treeItem(nodesData.get(edge.source)!),
          defaultExpanded: false,
          level: 0,
        });
      });
    setDependentStructure(_dependentStructure);

    // Generate children dependency
    setDependencyStructure(attachChildFromEdges(_dependencyStructure, edgesData, nodesData, 0));
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
              {dependentStructure && dependentStructure.length > 0 ? (
                <TreeView data={dependentStructure} allExpanded={allExpanded} />
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
          {visible && dependencyStructure && <TreeView data={[dependencyStructure]} allExpanded={allExpanded} />}
        </div>
      </DataContainer>
    </>
  );
};
