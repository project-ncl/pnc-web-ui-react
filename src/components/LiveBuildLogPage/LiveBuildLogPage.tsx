import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { buildLogMatchFiltersPrefix, buildLogPrefixFilters, useBifrostWebSocketEffect } from 'hooks/useBifrostWebSocketEffect';
import { useDataBuffer } from 'hooks/useDataBuffer';
import { useParamsRequired } from 'hooks/useParamsRequired';

import { LOG_VIEWER_HEIGHT_OFFSET } from 'components/BuildLogPage/BuildLogPage';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { LogViewer } from 'components/LogViewer/LogViewer';

import { timestampHiglighter } from 'utils/preprocessorHelper';

export const LiveBuildLogPage = () => {
  const navigate = useNavigate();

  const { buildId } = useParamsRequired();

  const { isBuilding } = useServiceContainerBuild();

  const [logBuffer, addLogLines, resetLogBuffer] = useDataBuffer(timestampHiglighter);

  const [isTailMode, setIsTailMode] = useState(true);

  const parameters = useMemo(
    () => ({
      tailLines: isTailMode ? 1000 : undefined,
    }),
    [isTailMode]
  );

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

  const tailModeCallback = (checked: boolean) => {
    resetLogBuffer();
    setIsTailMode(checked);
  };

  useBifrostWebSocketEffect(
    useCallback(
      (logLines) => {
        addLogLines(logLines);
      },
      [addLogLines]
    ),
    { parameters, filters }
  );

  return (
    <LogViewer
      data={logBuffer}
      heightOffset={LOG_VIEWER_HEIGHT_OFFSET}
      autofocusSearchBar
      isTailMode={isTailMode}
      tailModeCallback={tailModeCallback}
    />
  );
};
