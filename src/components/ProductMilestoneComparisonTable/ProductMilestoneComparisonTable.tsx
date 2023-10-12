import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  FlexProps,
} from '@patternfly/react-core';
import { CubesIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { ExpandableRowContent, InnerScrollContainer, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Product, ProductMilestone, ProductVersion } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterOptions } from 'common/entityAttributes';
import { productMilestoneComparisonEntityAttributes } from 'common/productMilestoneComparisonEntityAttributes';

import { DataValues, IServiceContainer } from 'hooks/useServiceContainer';

import { BuildName } from 'components/BuildName/BuildName';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { Filtering, IFilterOptions } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { StateCard } from 'components/StateCard/StateCard';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productApi from 'services/productApi';
import * as productVersionApi from 'services/productVersionApi';

interface IProductMilestoneColumn {
  id: string;
  version: string;
  link: string;
  productName: string;
  productLink: string;
}

const spaceItemsXs: FlexProps['spaceItems'] = { default: 'spaceItemsXs' };
const flexWrapNone: FlexProps['flexWrap'] = { default: 'nowrap' };

interface IProductMilestoneComparisonTableProps {
  serviceContainerProductMilestoneComparisonTable: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Artifacts and their versions in Product Milestones.
 *
 * @param serviceContainerProductMilestoneComparisonTable - Service Container for Product Milestone Comparison table
 * @param componentId - Component ID
 */
export const ProductMilestoneComparisonTable = ({
  serviceContainerProductMilestoneComparisonTable,
  componentId,
}: IProductMilestoneComparisonTableProps) => {
  const [wereColumnsChanged, setWereColumnsChanged] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedProductVersion, setSelectedProductVersion] = useState<ProductVersion>();
  const [selectedProductMilestone, setSelectedProductMilestone] = useState<ProductMilestone>();
  const [productMilestoneColumns, setProductMilestoneColumns] = useState<IProductMilestoneColumn[]>([]);

  const [expandedArtifacts, setExpandedArtifacts] = useState<string[]>([]);
  const [areAllArtifactsExpanded, setAreAllArtifactsExpanded] = useState<boolean>();
  const setArtifactExpanded = (artifact: any, isExpanding = true) =>
    setExpandedArtifacts((prevExpanded) => {
      const otherExpandedArtifactIdentifiers = prevExpanded.filter((identifier) => identifier !== artifact.identifier);
      return isExpanding ? [...otherExpandedArtifactIdentifiers, artifact.identifier] : otherExpandedArtifactIdentifiers;
    });
  const isArtifactExpanded = (artifact: any) => expandedArtifacts?.includes(artifact.identifier);

  const fetchProductVersions = useCallback(
    (requestConfig: AxiosRequestConfig = {}) => {
      return selectedProduct ? productApi.getProductVersions({ id: selectedProduct.id }, requestConfig) : Promise.resolve([]);
    },
    [selectedProduct]
  );

  const fetchProductMilestones = useCallback(
    (requestConfig: AxiosRequestConfig = {}) => {
      return selectedProductVersion
        ? productVersionApi.getProductMilestones({ id: selectedProductVersion.id }, requestConfig)
        : Promise.resolve([]);
    },
    [selectedProductVersion]
  );

  const serviceContainerProductMilestoneComparisonTableRunner = serviceContainerProductMilestoneComparisonTable.run;

  useEffect(() => {
    if (areAllArtifactsExpanded === true) {
      setExpandedArtifacts(
        serviceContainerProductMilestoneComparisonTable.data?.content.map((artifact: any) => artifact.identifier)
      );
    } else if (areAllArtifactsExpanded === false) {
      setExpandedArtifacts([]);
    }
  }, [areAllArtifactsExpanded, serviceContainerProductMilestoneComparisonTable.data?.content]);

  const wasSelectedMilestoneAdded = productMilestoneColumns.some(
    (productMilestoneColumn) => selectedProductMilestone?.id === productMilestoneColumn.id
  );

  const disabledAddColumnButtonReason = wasSelectedMilestoneAdded ? 'This Milestone was already added.' : undefined;

  const disabledFetchButtonReason = !productMilestoneColumns.length
    ? 'No Milestone was added.'
    : !!selectedProductMilestone
    ? 'Selected Milestone was not added.'
    : undefined;

  // useMemo is React Hook. Hooks can not be executed conditionally.
  const filterOptions: IFilterOptions = useMemo(
    () => getFilterOptions({ entityAttributes: productMilestoneComparisonEntityAttributes }),
    []
  );

  const tableHead = (
    <Thead>
      <Tr>
        <Th
          modifier="fitContent"
          expand={{
            // probably a Patternfly bug, must be negated
            areAllExpanded: !areAllArtifactsExpanded,
            onToggle: () => {
              setAreAllArtifactsExpanded(areAllArtifactsExpanded !== undefined ? !areAllArtifactsExpanded : true);
            },
            collapseAllAriaLabel: '',
          }}
        />
        <Th width={15} modifier="fitContent">
          Artifact
        </Th>
        {productMilestoneColumns.map((productMilestoneColumn, index: number) => (
          <Th width={20} modifier="fitContent" key={index}>
            <Flex spaceItems={spaceItemsXs} flexWrap={flexWrapNone}>
              <FlexItem>
                <Link to={productMilestoneColumn.productLink}>{productMilestoneColumn.productName}</Link>
                {' · '}
                <Link to={productMilestoneColumn.link}>{productMilestoneColumn.version}</Link>
              </FlexItem>
              <FlexItem>
                <Button
                  onClick={() => {
                    const otherMilestoneColumns = productMilestoneColumns.filter(
                      (productMilestoneColumn2) => productMilestoneColumn2.id !== productMilestoneColumn.id
                    );
                    setProductMilestoneColumns(otherMilestoneColumns);
                    setWereColumnsChanged(true);
                  }}
                  variant="plain"
                  icon={<TimesCircleIcon />}
                  className="p-0"
                  isSmall
                  isInline
                />
              </FlexItem>
            </Flex>
          </Th>
        ))}
      </Tr>
    </Thead>
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <SearchSelect
            selectedItem={selectedProduct?.name}
            onSelect={(_, entity?: Product) => {
              setSelectedProduct(entity);
              setSelectedProductVersion(undefined);
              setSelectedProductMilestone(undefined);
            }}
            onClear={() => {
              setSelectedProduct(undefined);
              setSelectedProductVersion(undefined);
              setSelectedProductMilestone(undefined);
            }}
            fetchCallback={productApi.getProducts}
            titleAttribute="name"
            width={416}
            placeholderText="Select Product"
          />
        </ToolbarItem>
        <ToolbarItem>
          <SearchSelect
            selectedItem={selectedProductVersion?.version}
            onSelect={(_, entity?: ProductVersion) => {
              setSelectedProductVersion(entity);
              setSelectedProductMilestone(undefined);
            }}
            onClear={() => {
              setSelectedProductVersion(undefined);
              setSelectedProductMilestone(undefined);
            }}
            fetchCallback={fetchProductVersions}
            titleAttribute="version"
            width={200}
            placeholderText="Select Version"
            isDisabled={!selectedProduct}
          />
        </ToolbarItem>
        <ToolbarItem>
          <SearchSelect
            selectedItem={selectedProductMilestone?.version}
            onSelect={(_, entity?: ProductMilestone) => setSelectedProductMilestone(entity)}
            onClear={() => setSelectedProductMilestone(undefined)}
            fetchCallback={fetchProductMilestones}
            titleAttribute="version"
            width={200}
            placeholderText="Select Milestone"
            isDisabled={!selectedProduct || !selectedProductVersion}
          />
        </ToolbarItem>
        <ToolbarItem>
          <TooltipWrapper tooltip={disabledAddColumnButtonReason}>
            <Button
              onClick={() => {
                setProductMilestoneColumns((columns) => [
                  ...columns,
                  {
                    id: selectedProductMilestone!.id,
                    version: selectedProductMilestone!.version,
                    link: `/products/${selectedProduct!.id}/versions/${selectedProductVersion!.id}/milestones/${
                      selectedProductMilestone!.id
                    }`,
                    productName: selectedProduct!.name,
                    productLink: `/products/${selectedProduct!.id}`,
                  },
                ]);
                setWereColumnsChanged(true);
                setSelectedProductMilestone(undefined);
              }}
              variant="secondary"
              // https://www.patternfly.org/v4/components/tooltip/accessibility/#additional-considerations
              isAriaDisabled={!selectedProductMilestone || wasSelectedMilestoneAdded}
            >
              Add column
            </Button>
          </TooltipWrapper>
        </ToolbarItem>
        <ToolbarItem>
          <TooltipWrapper tooltip={disabledFetchButtonReason}>
            <Button
              onClick={() => {
                serviceContainerProductMilestoneComparisonTableRunner({
                  serviceData: {
                    data: {
                      productMilestones: productMilestoneColumns.map((productMilestoneColumn) => productMilestoneColumn.id),
                    },
                  },
                }).then(() => {
                  setWereColumnsChanged(false);
                });
              }}
              isLoading={serviceContainerProductMilestoneComparisonTable.loading}
              isAriaDisabled={
                !productMilestoneColumns.length ||
                !!selectedProductMilestone ||
                serviceContainerProductMilestoneComparisonTable.loading ||
                !wereColumnsChanged
              }
            >
              Fetch
            </Button>
          </TooltipWrapper>
        </ToolbarItem>
      </Toolbar>
      {serviceContainerProductMilestoneComparisonTable.data !== DataValues.notYetData && (
        <Toolbar borderTop>
          <ToolbarItem>
            <Filtering filterOptions={filterOptions} componentId={componentId} />
          </ToolbarItem>
        </Toolbar>
      )}

      <ContentBox borderTop>
        <ServiceContainerLoading
          {...serviceContainerProductMilestoneComparisonTable}
          title={PageTitles.productMilestoneComparison}
          notYetContent={
            <>
              <InnerScrollContainer>
                <TableComposable isStriped variant="compact">
                  {!!productMilestoneColumns.length && tableHead}
                </TableComposable>
              </InnerScrollContainer>
              <ContentBox>
                <StateCard icon={CubesIcon} title="Add columns and fetch data" />
              </ContentBox>
            </>
          }
        >
          <InnerScrollContainer>
            <TableComposable isExpandable isStriped variant="compact">
              {/* table head */}
              {(!!productMilestoneColumns.length ||
                serviceContainerProductMilestoneComparisonTable.data !== DataValues.notYetData) &&
                tableHead}

              {/* table body */}
              {serviceContainerProductMilestoneComparisonTable.data !== DataValues.notYetData &&
                serviceContainerProductMilestoneComparisonTable.data?.content?.map((artifact: any, rowIndex: number) => (
                  <Tbody key={rowIndex}>
                    <Tr>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded: isArtifactExpanded(artifact),
                          onToggle: () => {
                            setArtifactExpanded(artifact, !isArtifactExpanded(artifact));
                            setAreAllArtifactsExpanded(undefined);
                          },
                        }}
                      />
                      <Td>{artifact.identifier}</Td>
                      {productMilestoneColumns.map((productMilestoneColumn, index: number) => {
                        const productMilestoneRef = artifact.productMilestones[productMilestoneColumn.id];
                        return (
                          <Td key={index}>
                            {productMilestoneRef && (
                              <Link to={`/artifacts/${productMilestoneRef.artifactId}`}>
                                {productMilestoneRef.artifactVersion}
                              </Link>
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                    <Tr isExpanded={isArtifactExpanded(artifact)}>
                      <Td />
                      <Td />
                      {productMilestoneColumns.map((productMilestoneColumn) => {
                        const productMilestoneRef = artifact.productMilestones[productMilestoneColumn.id];
                        return (
                          <Td>
                            {productMilestoneRef && (
                              <ExpandableRowContent>
                                <DescriptionList isHorizontal isCompact isFluid>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>
                                      Build
                                      <TooltipWrapper
                                        tooltip={
                                          productMilestoneRef.build
                                            ? 'Build which produced this Artifact version.'
                                            : 'This Artifact version was not produced by any PNC Build.'
                                        }
                                      />
                                    </DescriptionListTerm>
                                    <DescriptionListDescription>
                                      {productMilestoneRef.build ? (
                                        <>
                                          <BuildName build={productMilestoneRef.build} long includeBuildLink includeConfigLink />{' '}
                                          (
                                          <Link to={`/builds/${productMilestoneRef.build.id}`}>
                                            #{productMilestoneRef.build.id}
                                          </Link>
                                          )
                                        </>
                                      ) : (
                                        <EmptyStateSymbol />
                                      )}
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </ExpandableRowContent>
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  </Tbody>
                ))}
            </TableComposable>
          </InnerScrollContainer>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerProductMilestoneComparisonTable.data?.totalHits} />
    </>
  );
};
