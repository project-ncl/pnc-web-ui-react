import { useCallback, useMemo } from 'react';

import { buildLogMatchFiltersPrefix, buildLogPrefixFilters, useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';

import { LOG_VIEWER_HEIGHT_OFFSET } from 'components/BuildLogPage/BuildLogPage';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const LiveBuildLogPage = () => {
  const { buildId } = useParamsRequired();

  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  const filters = useMemo(
    () => ({
      prefixFilters: buildLogPrefixFilters,
      matchFilters: `${buildLogMatchFiltersPrefix}${buildId}`,
    }),
    [buildId]
  );

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    { filters }
  );

  return (
    <ContentBox>
      <ContentBox padding>
        <LogViewer data={logBuffer} heightOffset={LOG_VIEWER_HEIGHT_OFFSET} autofocusSearchBar />
      </ContentBox>
    </ContentBox>
  );
};
