import { Button, Label, NumberInput, SearchInput, Switch, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFullscreen } from 'hooks/useFullscreen';
import { useParamsRequired } from 'hooks/useParamsRequired';
import { listMandatoryQueryParams, useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { ExperimentalContent } from 'components/ExperimentalContent/ExperimentalContent';
import { ExperimentalContentMarker } from 'components/ExperimentalContent/ExperimentalContentMarker';
import { FullscreenButton } from 'components/FullscreenButton/FullscreenButton';
import { ProductMilestoneInterconnectionGraph } from 'components/NetworkGraphs/ProductMilestoneInterconnectionGraph';
import { useServiceContainerProductMilestone } from 'components/ProductMilestonePages/ProductMilestonePages';
import { ProductMilestoneReleaseLabel } from 'components/ProductMilestoneReleaseLabel/ProductMilestoneReleaseLabel';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { updateQueryParamsInURL } from 'utils/queryParamsHelper';

import styles from './ProductMilestoneInterconnectionGraphPage.module.css';

const sharedDeliveredArtifactsListColumns = ['identifier', 'product.name', 'productMilestone.version', 'build'];

const mandatoryQueryParams = { pagination: true, sorting: true, milestone: true };

interface IProductMilestoneInterconnectionGraphPageProps {
  componentId?: string;
}

export const ProductMilestoneInterconnectionGraphPage = ({
  componentId = 'a1',
}: IProductMilestoneInterconnectionGraphPageProps) => {
  const { productMilestoneId } = useParamsRequired();

  const location = useLocation();
  const navigate = useNavigate();

  const { serviceContainerProductMilestone } = useServiceContainerProductMilestone();

  const serviceContainerInterconnectionGraph = useServiceContainer(productMilestoneApi.getInterconnectionGraph);
  const serviceContainerInterconnectionGraphRunner = serviceContainerInterconnectionGraph.run;

  const serviceContainerSharedDeliveredArtifacts = useServiceContainer(productMilestoneApi.getSharedDeliveredArtifacts);
  const serviceContainerSharedDeliveredArtifactsRunner = serviceContainerSharedDeliveredArtifacts.run;

  const serviceContainerProductMilestone1 = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerProductMilestone1Runner = serviceContainerProductMilestone1.run;
  const serviceContainerProductMilestone2 = useServiceContainer(productMilestoneApi.getProductMilestone);
  const serviceContainerProductMilestone2Runner = serviceContainerProductMilestone2.run;

  const [hasLimitedNesting, setHasLimitedNesting] = useState<boolean>(true);
  const [nestingLevel, setNestingLevel] = useState<number>(10);
  const [searchValueProduct, setSearchValueProduct] = useState<string>('');
  const [searchValueProductMilestone, setSearchValueProductMilestone] = useState<string>('');
  const [showSharedDeliveredArtifactsList, setShowSharedDeliveredArtifactsList] = useState<boolean>(false);

  const graphDivRef = useRef<HTMLDivElement>(null);
  const graphContentOffet = (graphDivRef.current?.children[1] as any)?.offsetTop;
  const sharedDeliveredArtifactsListTopRef = useRef<HTMLDivElement>(null);

  const { isFullscreen } = useFullscreen();

  const loadSharedDeliveredArtifacts = useCallback(
    (milestone1: any, milestone2: any) => {
      updateQueryParamsInURL(
        { milestone1: milestone1 ? milestone1.id : '', milestone2: milestone2 ? milestone2.id : '', pageIndex: 1 },
        componentId,
        location,
        navigate
      );
    },
    [componentId, location, navigate]
  );

  useEffect(() => {
    serviceContainerInterconnectionGraphRunner({
      serviceData: { id: productMilestoneId },
    });
  }, [serviceContainerInterconnectionGraphRunner, productMilestoneId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => {
        serviceContainerSharedDeliveredArtifactsRunner({ requestConfig });
        serviceContainerProductMilestone1Runner({ serviceData: { id: requestConfig?.params.milestone1 } });
        serviceContainerProductMilestone2Runner({ serviceData: { id: requestConfig?.params.milestone2 } });
      },
      [
        serviceContainerSharedDeliveredArtifactsRunner,
        serviceContainerProductMilestone1Runner,
        serviceContainerProductMilestone2Runner,
      ]
    ),
    {
      componentId,
      mandatoryQueryParams: mandatoryQueryParams,
    }
  );

  // URL -> UI
  useQueryParamsEffect(
    useCallback(({ requestConfig } = {}) => {
      if (requestConfig?.params.milestone1 && requestConfig?.params.milestone2) {
        setShowSharedDeliveredArtifactsList(true);
        // scroll to the list when edge in the graph is selected
        sharedDeliveredArtifactsListTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setShowSharedDeliveredArtifactsList(false);
      }
    }, []),
    { componentId, mandatoryQueryParams: listMandatoryQueryParams.none }
  );

  return (
    <ExperimentalContent>
      <ExperimentalContentMarker dataSource="mock" contentType="box" showTooltip>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Product Milestone Interconnection Graph</Text>
            </TextContent>
            <TextContent>
              <Text component={TextVariants.p}>
                Edges interconnect Product Milestones sharing Delivered Artifacts. An edge number represents the number of shared
                Delivered Artifacts between the two Milestones. Clicking on an edge displays a list of shared Delivered Artifacts.
                The graph size can be limited by adjusting the nesting level. Nodes can be selected by clicking on them to
                highlight them and their neighbors. Double-clicking on a node opens the Milestone detail page. To drag a node,
                hold down the <Label>Shift</Label> key and the mouse button and click on the node.
              </Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>

        <div ref={graphDivRef} className="position-relative">
          <Toolbar borderTop>
            <ToolbarItem>
              <SearchInput
                placeholder="Find Product"
                value={searchValueProduct}
                onChange={(_, value) => setSearchValueProduct(value)}
                onClear={() => setSearchValueProduct('')}
              />
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Find Milestone"
                value={searchValueProductMilestone}
                onChange={(_, value) => setSearchValueProductMilestone(value)}
                onClear={() => setSearchValueProductMilestone('')}
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
            <ServiceContainerLoading
              {...serviceContainerInterconnectionGraph}
              hasSkeleton
              title="Product Milestone Interconnection Graph"
            >
              <ProductMilestoneInterconnectionGraph
                data={serviceContainerInterconnectionGraph.data}
                mainNode={serviceContainerProductMilestone.data!.version}
                hasLimitedNesting={hasLimitedNesting}
                nestingLevel={nestingLevel}
                searchValueMainLabel={searchValueProductMilestone}
                searchValueSubLabel={searchValueProduct}
                onEdgeSelected={loadSharedDeliveredArtifacts}
                componentId={componentId}
              />
            </ServiceContainerLoading>
          </ContentBox>
          <FullscreenButton containerRef={graphDivRef} />
        </div>

        {showSharedDeliveredArtifactsList && (
          <>
            <div ref={sharedDeliveredArtifactsListTopRef} />
            <Toolbar>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>
                    Shared Delivered Artifacts between{' '}
                    <ServiceContainerLoading {...serviceContainerProductMilestone1} variant="icon" title="Product Milestone">
                      <span className={styles['product-milestone-label']}>
                        <ProductMilestoneReleaseLabel
                          productMilestoneRelease={serviceContainerProductMilestone1.data!}
                          isCurrent={false}
                        />
                      </span>
                    </ServiceContainerLoading>{' '}
                    and{' '}
                    <ServiceContainerLoading {...serviceContainerProductMilestone2} variant="icon" title="Product Milestone">
                      <span className={styles['product-milestone-label']}>
                        <ProductMilestoneReleaseLabel
                          productMilestoneRelease={serviceContainerProductMilestone2.data!}
                          isCurrent={false}
                        />
                      </span>
                    </ServiceContainerLoading>
                  </Text>
                </TextContent>
              </ToolbarItem>
              <ToolbarItem alignRight>
                <TooltipWrapper tooltip="Close this table.">
                  <Button
                    variant="plain"
                    onClick={() =>
                      updateQueryParamsInURL({ milestone1: '', milestone2: '', pageIndex: 1 }, componentId, location, navigate)
                    }
                  >
                    <TimesIcon />
                  </Button>
                </TooltipWrapper>
              </ToolbarItem>
            </Toolbar>
            <ArtifactsList
              columns={sharedDeliveredArtifactsListColumns}
              serviceContainerArtifacts={serviceContainerSharedDeliveredArtifacts}
              componentId={componentId}
            />
          </>
        )}
      </ExperimentalContentMarker>
    </ExperimentalContent>
  );
};
