import { Button } from '@patternfly/react-core';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { isBuildCancelable } from 'utils/utils';

interface ICancelBuildModalButtonProps {
  toggleModal: () => void;
  build: Build | GroupBuild;
  variant: 'Build' | 'Group Build';
}

export const CancelBuildModalButton = ({ toggleModal, build, variant }: ICancelBuildModalButtonProps) => {
  const entityName = variant;
  const disabledButtonReason = build.status && !isBuildCancelable(build.status) ? `${entityName} is not in progress.` : '';

  return (
    <ProtectedComponent>
      <TooltipWrapper tooltip={disabledButtonReason}>
        <Button variant="primary" onClick={toggleModal} isAriaDisabled={!!disabledButtonReason} size="sm">
          Abort
        </Button>
      </TooltipWrapper>
    </ProtectedComponent>
  );
};
