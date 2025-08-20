import { DeliverableAnalyzerOperation, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { ButtonTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ProtectedProgressButton } from 'components/ProgressButton/ProgressButton';

type IDeliverableAnalysisAddLabelModalButtonProps = {
  toggleModal: () => void;
  deliverableAnalysisOperation: DeliverableAnalyzerOperation;
  serviceContainerDeliverableAnalysisReport: IServiceContainerState<DeliverableAnalyzerReport>;
};

export const DeliverableAnalysisAddLabelModalButton = ({
  toggleModal,
  deliverableAnalysisOperation,
  serviceContainerDeliverableAnalysisReport,
}: IDeliverableAnalysisAddLabelModalButtonProps) => {
  const disabledButtonReason =
    deliverableAnalysisOperation.result !== 'SUCCESSFUL'
      ? 'Analysis which is not successfully finished cannot be assigned label.'
      : '';

  const isDisabled = !!disabledButtonReason || !!serviceContainerDeliverableAnalysisReport.error;

  return (
    <ProtectedProgressButton
      variant="secondary"
      onClick={toggleModal}
      isDisabled={isDisabled}
      serviceContainer={serviceContainerDeliverableAnalysisReport}
      disabledTooltip={disabledButtonReason}
      isSmall
    >
      {ButtonTitles.add} label
    </ProtectedProgressButton>
  );
};
