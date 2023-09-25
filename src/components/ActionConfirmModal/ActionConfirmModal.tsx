import { PropsWithChildren } from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ActionModal } from 'components/ActionModal/ActionModal';

interface IActionConfirmModalProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: () => void;
  actionTitle?: string;
  cancelTitle?: string;
  serviceContainer?: IServiceContainer;
}

/**
 * Modal used for the confirmation of an action.
 *
 * @param title - title of the modal
 * @param actionTitle - title of the confirm submit action button
 * @param cancelTitle - title of the cancel modal button
 * @param isOpen - is the modal open?
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
  onToggle,
  onSubmit,
  serviceContainer,
}: PropsWithChildren<IActionConfirmModalProps>) => (
  <ActionModal
    modalTitle={title}
    actionTitle={actionTitle}
    cancelTitle={cancelTitle}
    isOpen={isOpen}
    onToggle={onToggle}
    onSubmit={onSubmit}
    serviceContainer={serviceContainer}
    modalVariant="medium"
  >
    {children}
  </ActionModal>
);
