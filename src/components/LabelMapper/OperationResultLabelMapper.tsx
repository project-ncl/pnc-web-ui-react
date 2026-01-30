import { OperationOutcome } from 'pnc-api-types-ts';

import { operationResultColorMap } from 'common/colorMap';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';
import { LabelMapper } from 'components/LabelMapper/LabelMapper';

import styles from './OperationResultLabelMapper.module.css';

/**
 * Represents a label for operation outcomes.
 *
 * @param outcome - operation outcome with details
 * @param isDetailed - if passed, detailed variant will be displayed
 */
interface IOperationResultLabelMapperProps {
  outcome: OperationOutcome;
  isDetailed?: boolean;
}

export const OperationResultLabelMapper = ({ outcome, isDetailed }: IOperationResultLabelMapperProps) => {
  const config = operationResultColorMap[outcome.result] ?? { text: outcome.result };

  const isUnsuccessful = ['FAILED', 'SYSTEM_ERROR', 'TIMEOUT', 'REJECTED'].includes(outcome.result);

  const anyDetailsAvailable = outcome.reason || outcome.proposal;

  const showDetails = isUnsuccessful || anyDetailsAvailable;

  if (showDetails) {
    if (isDetailed) {
      return (
        <div className={styles['box']}>
          <div className={styles['row']}>
            <LabelMapper mapperItem={config} />
          </div>
          <div className={styles['row']}>
            <strong>Reason:</strong> {outcome?.reason ? outcome?.reason : <EmptyStateSymbol text="Not available" />}
          </div>
          <div className={styles['row']}>
            <strong>Proposal:</strong> {outcome?.proposal ? outcome?.proposal : <EmptyStateSymbol text="Not available" />}
          </div>
        </div>
      );
    }

    const tooltip = [outcome.reason, outcome.proposal].filter(Boolean).join(' >> ');
    return <LabelMapper mapperItem={config} tooltip={tooltip} />;
  }

  return <LabelMapper mapperItem={config} />;
};
