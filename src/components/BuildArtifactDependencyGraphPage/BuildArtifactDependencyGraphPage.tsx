import { Button, Label, NumberInput, SearchInput, Switch, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useFullscreen } from 'hooks/useFullscreen';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { BuildName } from 'components/BuildName/BuildName';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { FullscreenButton } from 'components/FullscreenButton/FullscreenButton';
import { BuildArtifactDependencyGraph } from 'components/NetworkGraphs/BuildArtifactDependencyGraph';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as buildApi from 'services/buildApi';

import { updateQueryParamsInURL } from 'utils/queryParamsHelper';

interface IBuildArtifactDependencyGraphPageProps {
  componentId?: string;
}

export const BuildArtifactDependencyGraphPage = ({ componentId = 'a1' }: IBuildArtifactDependencyGraphPageProps) => {
  const { buildId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerDependencyGraph = useServiceContainer(buildApi.getArtifactDependencyGrah);
  const serviceContainerDependencyGraphRunner = serviceContainerDependencyGraph.run;

  const serviceContainerArtifactDependencies = useServiceContainer(buildApi.getArtifactDependencies);
  const serviceContainerArtifactDependenciesRunner = serviceContainerArtifactDependencies.run;

  const serviceContainerDependentBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerDependentBuildRunner = serviceContainerDependentBuild.run;
  const serviceContainerDependencyBuild = useServiceContainer(buildApi.getBuild);
  const serviceContainerDependencyBuildRunner = serviceContainerDependencyBuild.run;

  const [hasLimitedNesting, setHasLimitedNesting] = useState<boolean>(true);
  const [nestingLevel, setNestingLevel] = useState<number>(10);
  const [searchValueBuild, setSearchValueBuild] = useState<string>('');
  const [searchValueBuildConfig, setSearchValueBuildConfig] = useState<string>('');
  const [showArtifactDependenciesList, setShowArtifactDependenciesList] = useState<boolean>(false);

  const graphDivRef = useRef<HTMLDivElement>(null);
  const graphContentOffet = (graphDivRef.current?.children[1] as any)?.offsetTop;
  const artifactDependenciesListTopRef = useRef<HTMLDivElement>(null);

  const { isFullscreen } = useFullscreen();

  const loadArtifactDependencies = useCallback(
    (dependentBuild: any, dependencyBuild: any) => {
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
  }, [serviceContainerDependencyGraphRunner, buildId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerArtifactDependenciesRunner({ requestConfig });
      serviceContainerDependentBuildRunner({ serviceData: { id: requestConfig?.params.dependentBuild } });
      serviceContainerDependencyBuildRunner({ serviceData: { id: requestConfig?.params.dependencyBuild } });
    },
    {
      componentId,
      mandatoryQueryParams: { pagination: true, sorting: true, buildDependency: true },
    }
  );

  //URL -> UI
  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      if (requestConfig?.params.dependentBuild && requestConfig?.params.dependencyBuild) {
        setShowArtifactDependenciesList(true);
        // scroll to the list when edge in the graph is selected
        artifactDependenciesListTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setShowArtifactDependenciesList(false);
      }
    },
    { componentId, mandatoryQueryParams: { pagination: false, sorting: false } }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component={TextVariants.h2}>Build Artifact Dependency Graph</Text>
          </TextContent>
          <TextContent>
            <Text component={TextVariants.p}>
              Edge arrows point from Builds that have Artifact (build-time) dependencies to the Builds that produced those
              dependencies. A build-time dependency is an Artifact used by a Build and produced by another Build. An edge number
              represents the number of Artifact dependencies. Clicking on an edge displays a list of the Artifact dependencies.
              The graph size can be limited by adjusting the nesting level. Nodes can be selected by clicking on them to highlight
              them and their neighbors. Double-clicking on a node opens the Build detail page. To drag a node, hold down the{' '}
              <Label>Shift</Label> key and the mouse button and click on the node.
            </Text>
          </TextContent>
        </ToolbarItem>
      </Toolbar>

      <div ref={graphDivRef} className="position-relative">
        <Toolbar borderTop>
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
              labelOff="Limit nesting"
              isChecked={hasLimitedNesting}
              onChange={(checked) => setHasLimitedNesting(checked)}
            />
          </ToolbarItem>
          <ToolbarItem>
            <NumberInput
              min={0}
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

        <ContentBox marginBottom borderTop contentHeight={isFullscreen ? `calc(100vh - ${graphContentOffet}px)` : '60vh'}>
          <ServiceContainerLoading {...serviceContainerDependencyGraph} hasSkeleton title="Build Artifact Dependency Graph">
            <BuildArtifactDependencyGraph
              data={serviceContainerDependencyGraph.data}
              mainNode={serviceContainerBuild.data?.id}
              hasLimitedNesting={hasLimitedNesting}
              nestingLevel={nestingLevel}
              searchValueMainLabel={searchValueBuild}
              searchValueSubLabel={searchValueBuildConfig}
              onEdgeSelected={loadArtifactDependencies}
              componentId={componentId}
            />
          </ServiceContainerLoading>
        </ContentBox>
        <FullscreenButton containerRef={graphDivRef} />
      </div>

      {showArtifactDependenciesList && (
        <>
          <div ref={artifactDependenciesListTopRef} />
          <Toolbar>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h2}>
                  Artifact dependencies used by{' '}
                  <ServiceContainerLoading {...serviceContainerDependentBuild} variant="icon" title="Build">
                    <BuildName build={serviceContainerDependentBuild.data} long includeBuildLink includeConfigLink />
                  </ServiceContainerLoading>{' '}
                  and produced by{' '}
                  <ServiceContainerLoading {...serviceContainerDependencyBuild} variant="icon" title="Build">
                    <BuildName build={serviceContainerDependencyBuild.data} long includeBuildLink includeConfigLink />
                  </ServiceContainerLoading>
                </Text>
              </TextContent>
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
                >
                  <TimesIcon />
                </Button>
              </TooltipWrapper>
            </ToolbarItem>
          </Toolbar>
          <ArtifactsList serviceContainerArtifacts={serviceContainerArtifactDependencies} componentId={componentId} />
        </>
      )}
    </>
  );
};
