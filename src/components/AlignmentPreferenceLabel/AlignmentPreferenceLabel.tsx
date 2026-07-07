import { CheckIcon } from '@patternfly/react-icons';

import { Build } from 'common/pnc-api-types-ts';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';

import { uiLogger } from 'services/uiLogger';

interface IAlignmentPreferenceLabelProps {
  alignmentPreference: Build['alignmentPreference'];
  temporaryBuild: Build['temporaryBuild'];
}

export const AlignmentPreferenceLabel = ({ alignmentPreference, temporaryBuild }: IAlignmentPreferenceLabelProps) => {
  if (!alignmentPreference) {
    // TEMPORARY BUILD
    if (temporaryBuild) {
      // invalid state: Build is temporary
      uiLogger.error('REST API: alignmentPreference should be defined when Build is temporary');
      return <EmptyStateSymbol />;
    }

    // PERSISTENT BUILD
    // valid state: empty value is expected when Build is persistent
    return (
      <span title="Empty value is expected, Alignment Preference is available only for temporary builds.">
        <EmptyStateSymbol />
        <CheckIcon />
      </span>
    );
  }

  // valid state: individual values
  if (alignmentPreference === 'PREFER_PERSISTENT') {
    return 'Persistent';
  }
  if (alignmentPreference === 'PREFER_TEMPORARY') {
    return 'Temporary';
  }

  // semi-valid state: unkown string based value was provided
  if (typeof alignmentPreference === 'string') {
    uiLogger.log('REST API: unknown string based alignmentPreference value was provided: ' + alignmentPreference);
    return alignmentPreference;
  }

  // invalid state: unkonwn non-string based value was provided
  const unknownValue = JSON.stringify(alignmentPreference);
  uiLogger.error('REST API: unknown non-string based alignmentPreference value was provided: ' + unknownValue);
  return unknownValue;
};
