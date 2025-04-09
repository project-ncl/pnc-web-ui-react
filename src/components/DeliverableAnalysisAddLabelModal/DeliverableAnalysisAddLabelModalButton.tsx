import { DeliverableAnalyzerOperation, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { ButtonTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ProgressButton } from 'components/ProgressButton/ProgressButton';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

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
    <ProtectedComponent>
      <ProgressButton
        variant="tertiary"
        onClick={toggleModal}
        isDisabled={isDisabled}
        serviceContainer={serviceContainerDeliverableAnalysisReport}
        disabledTooltip={disabledButtonReason}
        isSmall
      >
        {ButtonTitles.add} label
      </ProgressButton>
    </ProtectedComponent>
  );
};
