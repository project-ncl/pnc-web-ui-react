import { Button, Modal, ModalProps, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { CheckIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren, ReactElement, useState } from 'react';

import { useRefresh } from 'hooks/useRefresh';
import { DataValues, IServiceContainer } from 'hooks/useServiceContainer';

import { ServiceContainerCreatingUpdating } from 'components/ServiceContainers/ServiceContainerCreatingUpdating';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import styles from './ActionModal.module.css';

interface IActionModalProps {
  modalTitle: string;
  actionTitle: string;
  cancelTitle?: string;
  isOpen: boolean;
  isSubmitDisabled?: boolean;
  wereSubmitDataChanged?: boolean;
  onToggle: () => void;
  onSubmit: () => void;
  serviceContainer?: IServiceContainer;
  modalVariant: ModalProps['variant'];
  onSuccessActions?: ReactElement[];
}

/**
 * Modal used for the creating or updating action.
 *
 * @param modalTitle - title of the modal
 * @param actionTitle - title of the confirm action button
 * @param cancelTitle - title of the cancel modal button
 * @param isOpen - is the modal open?
 * @param isSubmitDisabled - is the confirm action button disabled?
 * @param wereSubmitDataChanged - were the modal (form) data to be submitted changed (if there are any)?
 * @param onToggle - function toggling the modal visibility
 * @param onSubmit - confirm action button callback
 * @param serviceContainer - service container of the confirm action
 * @param modalVariant - modal size variant
 * @param onSuccessActions - additional action buttons to be displayed after successful confirm action
 */
export const ActionModal = ({
  children,
  modalTitle,
  actionTitle,
  cancelTitle,
  isOpen,
  wereSubmitDataChanged,
  onToggle,
  onSubmit,
  serviceContainer,
  modalVariant,
  onSuccessActions,
  isSubmitDisabled = serviceContainer && serviceContainer.data !== DataValues.notYetData && !serviceContainer.error,
}: PropsWithChildren<IActionModalProps>) => {
  const refresh = useRefresh();

  const wasLastActionSuccessful =
    serviceContainer && serviceContainer.data !== DataValues.notYetData && !serviceContainer.error && !serviceContainer.loading;
  const [wasAnyActionSuccessful, setWasAnyActionSuccessful] = useState<boolean>(false);

  if (wasLastActionSuccessful && !wasAnyActionSuccessful) {
    setWasAnyActionSuccessful(true);
  }

  const wereSubmitDataChangedOrUndefined = wereSubmitDataChanged === undefined || !wereSubmitDataChanged;

  const onClose = () => {
    if (wasAnyActionSuccessful) {
      refresh();
    } else {
      onToggle();
    }
  };

  const modalContent = (
    <div className={css('p-t-global', 'p-l-global', 'p-r-global')}>
      <div className={css('p-b-global', styles['action-modal-header'])}>
        <TextContent className={styles['action-modal-title']}>
          <Text component={TextVariants.h1}>{modalTitle}</Text>
        </TextContent>
        <Button variant="plain" onClick={onClose} className={styles['action-modal-close-button']}>
          <TimesIcon />
        </Button>
      </div>
      {children}
    </div>
  );

  return (
    <Modal
      variant={modalVariant}
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        // TODO: NCL-8010
        <Button variant="primary" onClick={onSubmit} isDisabled={isSubmitDisabled || serviceContainer?.loading}>
          {serviceContainer && (!serviceContainer.error || serviceContainer.loading) && (
            <ServiceContainerLoading variant="icon" {...serviceContainer} title={actionTitle} />
          )}{' '}
          {wasLastActionSuccessful && wereSubmitDataChangedOrUndefined && <CheckIcon />} {actionTitle}
        </Button>,
        ...(wasLastActionSuccessful && onSuccessActions ? onSuccessActions : []),
        <Button variant="link" onClick={onClose}>
          {cancelTitle || (wasAnyActionSuccessful ? 'Close and refresh' : 'Cancel')}
        </Button>,
      ]}
      aria-label={modalTitle}
      hasNoBodyWrapper
      // custom close icon is implemented instead
      showClose={false}
    >
      {serviceContainer && wereSubmitDataChangedOrUndefined ? (
        <div className="m-r-0">
          <ServiceContainerCreatingUpdating {...serviceContainer} title={actionTitle}>
            {modalContent}
          </ServiceContainerCreatingUpdating>
        </div>
      ) : (
        <>{modalContent}</>
      )}
    </Modal>
  );
};
