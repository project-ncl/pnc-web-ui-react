import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { buildLogMatchFiltersPrefix, buildLogPrefixFilters, useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';

import { LOG_VIEWER_HEIGHT_OFFSET } from 'components/BuildLogPage/BuildLogPage';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { LogViewer } from 'components/LogViewer/LogViewer';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const LiveBuildLogPage = () => {
  const navigate = useNavigate();

  const { buildId } = useParamsRequired();

  const { isBuilding } = useServiceContainerBuild();

  const [logBuffer, addLogLines] = useDataBuffer(timestampHiglighter);

  const filters = useMemo(
    () => ({
      prefixFilters: buildLogPrefixFilters,
      matchFilters: `${buildLogMatchFiltersPrefix}${buildId}`,
    }),
    [buildId]
  );

  useEffect(() => {
    // Move navigate function call into useEffect to make navigation occurs after the component has rendered
    if (!isBuilding) {
      navigate(`/builds/${buildId}/build-log`, { replace: true });
    }
  }, [isBuilding, navigate, buildId]);

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
