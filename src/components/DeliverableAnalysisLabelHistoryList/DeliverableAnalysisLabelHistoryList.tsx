import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { DeliverableAnalyzerLabelEntryPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { deliverableAnalyzerLabelEntityAttributes } from 'common/deliverableAnalyzerLabelEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverableAnalysisLabelTooltip } from 'components/DeliverableAnalysisLabelTooltip/DeliverableAnalysisLabelTooltip';
import { InfoTooltip } from 'components/InfoTooltip/InfoTooltip';
import { DeliverableAnalysisLabelLabelMapper } from 'components/LabelMapper/DeliverableAnalysisLabelLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface IDeliverableAnalysisLabelsHistoryListProps {
  serviceContainerLabelsHistory: IServiceContainerState<DeliverableAnalyzerLabelEntryPage>;
  componentId: string;
}

/**
 * Component displaying history of labels on a Deliverable Analysis.
 *
 * @param serviceContainerLabelsHistory - Service Container for the label history
 * @param componentId - Component ID for pagination & storage
 */
export const DeliverableAnalysisLabelsHistoryList = ({
  serviceContainerLabelsHistory,
  componentId,
}: IDeliverableAnalysisLabelsHistoryListProps) => {
  return (
    <>
      <ContentBox>
        <ServiceContainerLoading {...serviceContainerLabelsHistory} title={PageTitles.deliverableAnalysisLabelsHistory}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{deliverableAnalyzerLabelEntityAttributes.date.title}</Th>
                <Th width={20}>{deliverableAnalyzerLabelEntityAttributes['user.username'].title}</Th>
                <Th width={15}>
                  {deliverableAnalyzerLabelEntityAttributes.label.title}
                  <InfoTooltip tooltip={<DeliverableAnalysisLabelTooltip />} />
                </Th>
                <Th width={15}>{deliverableAnalyzerLabelEntityAttributes.change.title}</Th>
                <Th width={30}>{deliverableAnalyzerLabelEntityAttributes.reason.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerLabelsHistory.data?.content?.map((labelEntry, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>{labelEntry.date && <DateTime date={labelEntry.date} />}</Td>
                  <Td>{labelEntry.user?.username}</Td>
                  <Td>{labelEntry.label && <DeliverableAnalysisLabelLabelMapper label={labelEntry.label} />}</Td>
                  <Td>{labelEntry.change}</Td>
                  <Td>{labelEntry.reason}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerLabelsHistory.data?.totalHits} />
    </>
  );
};
