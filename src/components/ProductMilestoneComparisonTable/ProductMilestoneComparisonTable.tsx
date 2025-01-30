import { Button, Flex, FlexItem, FlexProps } from '@patternfly/react-core';
import { CubesIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { InnerScrollContainer, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeliveredArtifactInMilestones, ParsedArtifact, Product, ProductMilestone, ProductVersion } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { SearchSelect } from 'components/SearchSelect/SearchSelect';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { StateCard } from 'components/StateCard/StateCard';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as productApi from 'services/productApi';
import { IProductMilestoneComparisonData } from 'services/productMilestoneApi';
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

const MIN_MILESTONES_IN_COMPARISON_COUNT = 2;

interface IProductMilestoneComparisonTableProps {
  serviceContainerProductMilestoneComparisonTable: IServiceContainer<
    DeliveredArtifactInMilestones[],
    IProductMilestoneComparisonData
  >;
}

/**
 * Component displaying list of Artifacts and their versions in Product Milestones.
 *
 * @param serviceContainerProductMilestoneComparisonTable - Service Container for Product Milestone Comparison table
 * @param componentId - Component ID
 */
export const ProductMilestoneComparisonTable = ({
  serviceContainerProductMilestoneComparisonTable,
}: IProductMilestoneComparisonTableProps) => {
  const [wereColumnsChanged, setWereColumnsChanged] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedProductVersion, setSelectedProductVersion] = useState<ProductVersion>();
  const [selectedProductMilestone, setSelectedProductMilestone] = useState<ProductMilestone>();
  const [productMilestoneColumns, setProductMilestoneColumns] = useState<IProductMilestoneColumn[]>([]);

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

  const wasSelectedMilestoneAdded = productMilestoneColumns.some(
    (productMilestoneColumn) => selectedProductMilestone?.id === productMilestoneColumn.id
  );

  const disabledAddColumnButtonReason = wasSelectedMilestoneAdded ? 'This Milestone was already added.' : undefined;

  const disabledFetchButtonReason = !productMilestoneColumns.length
    ? 'No Milestone was added.'
    : productMilestoneColumns.length < MIN_MILESTONES_IN_COMPARISON_COUNT
    ? `At least ${MIN_MILESTONES_IN_COMPARISON_COUNT} Milestones need to be compared.`
    : !!selectedProductMilestone
    ? 'Selected Milestone was not added.'
    : undefined;

  const tableHead = (
    <Thead>
      <Tr>
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
                  size="sm"
                  isInline
                />
              </FlexItem>
            </Flex>
          </Th>
        ))}
      </Tr>
    </Thead>
  );

  const emptyTable = (
    <InnerScrollContainer>
      <Table isStriped variant="compact">
        {!!productMilestoneColumns.length && tableHead}
      </Table>
    </InnerScrollContainer>
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <SearchSelect
            selectedItem={selectedProduct?.name}
            onSelect={(_event, _, entity?: Product) => {
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
            onSelect={(_event, _, entity?: ProductVersion) => {
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
            onSelect={(_event, _, entity?: ProductMilestone) => setSelectedProductMilestone(entity)}
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
              isAriaDisabled={!!disabledAddColumnButtonReason || !selectedProductMilestone}
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
                    productMilestoneIds: productMilestoneColumns.map((productMilestoneColumn) => productMilestoneColumn.id),
                  },
                  onSuccess: () => setWereColumnsChanged(false),
                });
              }}
              isLoading={serviceContainerProductMilestoneComparisonTable.loading}
              isAriaDisabled={
                !!disabledFetchButtonReason || serviceContainerProductMilestoneComparisonTable.loading || !wereColumnsChanged
              }
            >
              Fetch
            </Button>
          </TooltipWrapper>
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading
          {...serviceContainerProductMilestoneComparisonTable}
          title={PageTitles.productMilestoneComparison}
          emptyContent={
            <>
              {emptyTable}
              <ContentBox>
                <StateCard icon={CubesIcon} title="No common Delivered Artifacts" />
              </ContentBox>
            </>
          }
          notYetContent={
            <>
              {emptyTable}
              <ContentBox>
                <StateCard icon={CubesIcon} title="Add columns and fetch data" />
              </ContentBox>
            </>
          }
        >
          <InnerScrollContainer>
            <Table isExpandable isStriped variant="compact">
              {/* table head */}
              {!!productMilestoneColumns.length && tableHead}

              {/* table body */}
              {serviceContainerProductMilestoneComparisonTable.data?.map((deliveredArtifactInMilestones, rowIndex: number) => (
                <Tbody key={rowIndex}>
                  <Tr>
                    <Td>{deliveredArtifactInMilestones.artifactIdentifierPrefix}</Td>
                    {productMilestoneColumns.map((productMilestoneColumn, index: number) => {
                      const parsedArtifact =
                        productMilestoneColumn.id in deliveredArtifactInMilestones.productMilestoneArtifacts! &&
                        chooseArtifactDeliveredInMilestone(
                          deliveredArtifactInMilestones.productMilestoneArtifacts![productMilestoneColumn.id]
                        );

                      return (
                        <Td key={index}>
                          {parsedArtifact && <Link to={`/artifacts/${parsedArtifact.id}`}>{parsedArtifact.artifactVersion}</Link>}
                        </Td>
                      );
                    })}
                  </Tr>
                </Tbody>
              ))}
            </Table>
          </InnerScrollContainer>
        </ServiceContainerLoading>
      </ContentBox>
    </>
  );
};

const chooseArtifactDeliveredInMilestone = (parsedArtifacts: ParsedArtifact[]): ParsedArtifact | undefined => {
  // sorts primarily by classifier (null comes first), secondarily by type
  const sortedArtifacts = [...parsedArtifacts].sort((a, b) => {
    if (a.classifier === null && b.classifier !== null) return -1;
    if (a.classifier !== null && b.classifier === null) return 1;
    if (a.classifier !== null && b.classifier !== null) {
      const classifierCompare = a.classifier!.localeCompare(b.classifier!);
      if (classifierCompare !== 0) {
        return classifierCompare;
      }
    }

    return a.type!.localeCompare(b.type!);
  });

  return sortedArtifacts.at(0);
};
