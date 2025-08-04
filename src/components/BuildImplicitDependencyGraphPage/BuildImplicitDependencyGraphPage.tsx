import { Button, Content, ContentVariants, Label, NumberInput, SearchInput, Switch } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Build } from 'pnc-api-types-ts';

import { useFullscreen } from 'hooks/useFullscreen';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { BuildName } from 'components/BuildName/BuildName';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { FullscreenButton } from 'components/FullscreenButton/FullscreenButton';
import { BuildImplicitDependencyGraph } from 'components/NetworkGraphs/BuildImplicitDependencyGraph';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildApi from 'services/buildApi';

import { updateQueryParamsInURL } from 'utils/queryParamsHelper';

interface IBuildImplicitDependencyGraphPageProps {
  componentId?: string;
}

const mandatoryQueryParams = { pagination: true, sorting: true, buildDependency: true };

export const BuildImplicitDependencyGraphPage = ({ componentId = 'a1' }: IBuildImplicitDependencyGraphPageProps) => {
  const { buildId } = useParamsRequired();

  const location = useLocation();
  const navigate = useNavigate();

  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerDependencyGraph = useServiceContainer(buildApi.getImplicitDependencyGraph);
  const serviceContainerDependencyGraphRunner = serviceContainerDependencyGraph.run;

  const serviceContainerImplicitDependencies = useServiceContainer(buildApi.getImplicitDependencies);
  const serviceContainerImplicitDependenciesRunner = serviceContainerImplicitDependencies.run;

  const serviceContainerDependentBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerDependentBuildRunner = serviceContainerDependentBuild.run;
  const serviceContainerDependencyBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerDependencyBuildRunner = serviceContainerDependencyBuild.run;

  const [hasLimitedNesting, setHasLimitedNesting] = useState<boolean>(true);
  const [nestingLevel, setNestingLevel] = useState<number>(buildApi.MAX_IMPLICIT_DEPENDENCY_GRAPH_DEPTH);
  const [searchValueBuild, setSearchValueBuild] = useState<string>('');
  const [searchValueBuildConfig, setSearchValueBuildConfig] = useState<string>('');
  const [showImplicitDependenciesList, setShowImplicitDependenciesList] = useState<boolean>(false);

  const graphDivRef = useRef<HTMLDivElement>(null);
  const graphContentOffset = (graphDivRef.current?.children[1] as any)?.offsetTop;
  const implicitDependenciesListTopRef = useRef<HTMLDivElement>(null);

  const { isFullscreen } = useFullscreen();

  const loadImplicitDependencies = useCallback(
    (dependentBuild: Build, dependencyBuild: Build) => {
      updateQueryParamsInURL(
        {
          dependentBuild: dependentBuild ? dependentBuild.id : '',
          dependencyBuild: dependencyBuild ? dependencyBuild.id : '',
          pageIndex: 1,
        },
        componentId,
        location,
        navigate
      );
    },
    [componentId, location, navigate]
  );

  useEffect(() => {
    serviceContainerDependencyGraphRunner({
      serviceData: { id: buildId },
    });
  }, [buildId, serviceContainerDependencyGraphRunner]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => {
        serviceContainerImplicitDependenciesRunner({
          serviceData: { dependentId: requestConfig?.params.dependentBuild, dependencyId: requestConfig?.params.dependencyBuild },
        });
        serviceContainerDependentBuildRunner({ serviceData: { id: requestConfig?.params.dependentBuild } });
        serviceContainerDependencyBuildRunner({ serviceData: { id: requestConfig?.params.dependencyBuild } });
      },
      [serviceContainerImplicitDependenciesRunner, serviceContainerDependentBuildRunner, serviceContainerDependencyBuildRunner]
    ),
    {
      componentId,
      mandatoryQueryParams: mandatoryQueryParams,
    }
  );

  // URL -> UI
  useQueryParamsEffect(
    useCallback(({ requestConfig } = {}) => {
      if (requestConfig?.params.dependentBuild && requestConfig?.params.dependencyBuild) {
        setShowImplicitDependenciesList(true);
        // scroll to the list when edge in the graph is selected
        implicitDependenciesListTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setShowImplicitDependenciesList(false);
      }
    }, []),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.none }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Content>
            <Content component={ContentVariants.h2}>Implicit Dependency Graph</Content>
            <Content component={ContentVariants.p}>
              Edge arrows point from Builds that have implicit (build-time) dependencies to the Builds that produced those
              dependencies. An implicit or build-time dependency is an Artifact used by a Build and produced by another Build. An
              edge number represents the number of Artifact dependencies. Clicking on an edge displays a list of the Artifact
              dependencies. The graph size can be limited by adjusting the nesting level. Nodes can be selected by clicking on
              them to highlight them and their neighbors. Double-clicking on a node opens the Build detail page. To drag a node,
              hold down the <Label>Shift</Label> key and the mouse button and click on the node.
            </Content>
          </Content>
        </ToolbarItem>
      </Toolbar>

      <div ref={graphDivRef} className="position-relative">
        <Toolbar>
          <ToolbarItem>
            <SearchInput
              placeholder="Find Build"
              value={searchValueBuild}
              onChange={(_, value) => setSearchValueBuild(value)}
              onClear={() => setSearchValueBuild('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Find Build Config"
              value={searchValueBuildConfig}
              onChange={(_, value) => setSearchValueBuildConfig(value)}
              onClear={() => setSearchValueBuildConfig('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              label="Limit nesting"
              isChecked={hasLimitedNesting}
              onChange={(_, checked) => setHasLimitedNesting(checked)}
            />
          </ToolbarItem>
          <ToolbarItem>
            <NumberInput
              min={0}
              max={buildApi.MAX_IMPLICIT_DEPENDENCY_GRAPH_DEPTH}
              isDisabled={!hasLimitedNesting}
              value={nestingLevel}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                const value = (event.target as HTMLInputElement).value;
                setNestingLevel(+value);
              }}
              onMinus={() => setNestingLevel((prevNestingLevel) => prevNestingLevel - 1)}
              onPlus={() => setNestingLevel((prevNestingLevel) => prevNestingLevel + 1)}
            />
          </ToolbarItem>
        </Toolbar>

        <ContentBox marginBottom borderTop contentHeight={isFullscreen ? `calc(100vh - ${graphContentOffset}px)` : '60vh'}>
          <ServiceContainerLoading {...serviceContainerDependencyGraph} title="Implicit Dependency Graph">
            <BuildImplicitDependencyGraph
              data={serviceContainerDependencyGraph.data!}
              mainNode={serviceContainerBuild.data!.id}
              hasLimitedNesting={hasLimitedNesting}
              nestingLevel={nestingLevel}
              searchValueMainLabel={searchValueBuild}
              searchValueSubLabel={searchValueBuildConfig}
              onEdgeSelected={loadImplicitDependencies}
              componentId={componentId}
            />
          </ServiceContainerLoading>
        </ContentBox>
        <FullscreenButton containerRef={graphDivRef} position="bottom-left" />
      </div>

      {showImplicitDependenciesList && (
        <>
          <div ref={implicitDependenciesListTopRef} />
          <Toolbar>
            <ToolbarItem>
              <Content component={ContentVariants.h2}>
                Artifact dependencies used by{' '}
                <ServiceContainerLoading {...serviceContainerDependentBuild} variant="icon" title="Build">
                  <BuildName build={serviceContainerDependentBuild.data!} long includeBuildLink includeConfigLink />
                </ServiceContainerLoading>{' '}
                and produced by{' '}
                <ServiceContainerLoading {...serviceContainerDependencyBuild} variant="icon" title="Build">
                  <BuildName build={serviceContainerDependencyBuild.data!} long includeBuildLink includeConfigLink />
                </ServiceContainerLoading>
              </Content>
            </ToolbarItem>
            <ToolbarItem alignRight>
              <TooltipWrapper tooltip="Close this table.">
                <Button
                  variant="plain"
                  onClick={() =>
                    updateQueryParamsInURL(
                      { dependentBuild: '', dependencyBuild: '', pageIndex: 1 },
                      componentId,
                      location,
                      navigate
                    )
                  }
                  icon={<TimesIcon />}
                />
              </TooltipWrapper>
            </ToolbarItem>
          </Toolbar>
          <ArtifactsList serviceContainerArtifacts={serviceContainerImplicitDependencies} componentId={componentId} />
        </>
      )}
    </>
  );
};
