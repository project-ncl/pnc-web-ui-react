import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';

import { uiLogger } from 'services/uiLogger';

interface IRebuildModeLabelProps {
  // #pncTypes rebuildMode
  rebuildMode: null | 'IMPLICIT_DEPENDENCY_CHECK' | 'EXPLICIT_DEPENDENCY_CHECK' | 'FORCE';
}

export const RebuildModeLabel = ({ rebuildMode }: IRebuildModeLabelProps) => {
  // valid state: no value is available, for example older Builds
  if (!rebuildMode) {
    return <EmptyStateSymbol title="Rebuild Mode" />;
  }

  // valid state: individual values
  if (rebuildMode === 'IMPLICIT_DEPENDENCY_CHECK') {
    return 'Implicit';
  }
  if (rebuildMode === 'EXPLICIT_DEPENDENCY_CHECK') {
    return 'Explicit';
  }
  if (rebuildMode === 'FORCE') {
    return 'Force';
  }

  // semi-valid state: unknown string based value was provided
  if (typeof rebuildMode === 'string') {
    uiLogger.log('REST API: unknown string based rebuildMode value was provided: ' + rebuildMode);
    return rebuildMode;
  }

  // invalid state: unknown non-string based value was provided
  uiLogger.error('REST API: unknown non-string based rebuildMode value was provided: ' + JSON.stringify(rebuildMode));
  return <EmptyStateSymbol text={JSON.stringify(rebuildMode)} />;
};
