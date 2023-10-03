import { PropsWithChildren } from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

interface IActionConfirmModalProps {
  title: string;
  actionTitle?: string;
  cancelTitle?: string;
  isOpen: boolean;
  wereSubmitDataChanged?: boolean;
  onToggle: () => void;
  onSubmit: () => void;
  serviceContainer?: IServiceContainer;
}

/**
 * Modal used for the confirmation of an action.
 *
 * @param title - title of the modal
 * @param actionTitle - title of the confirm submit action button
 * @param cancelTitle - title of the cancel modal button
 * @param isOpen - is the modal open?
 * @param wereSubmitDataChanged - were the modal (form) data to be submitted changed (if there are any)?
 * @param onToggle - function toggling the modal visibility
 * @param onSubmit - confirm action button callback
 * @param serviceContainer - service container of the confirm action
 */
export const ActionConfirmModal = ({
  children,
  title,
  actionTitle = 'Confirm',
  cancelTitle = 'Cancel',
  isOpen,
  wereSubmitDataChanged,
  onToggle,
  onSubmit,
  serviceContainer,
}: PropsWithChildren<IActionConfirmModalProps>) => (
  <ActionModal
    modalTitle={title}
    actionTitle={actionTitle}
    cancelTitle={cancelTitle}
    isOpen={isOpen}
    wereSubmitDataChanged={wereSubmitDataChanged}
    onToggle={onToggle}
    onSubmit={onSubmit}
    serviceContainer={serviceContainer}
    modalVariant="medium"
  >
    {children}
  </ActionModal>
);
