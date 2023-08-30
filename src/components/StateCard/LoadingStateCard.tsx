import { Skeleton } from '@patternfly/react-core';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

import { StateCard } from './StateCard';

interface ILoadingStateCard {
  delayMs?: number;
  title: string;
  hasSkeleton?: boolean;
  isInline?: boolean;
}

/**
 * Loading State component with delayed render. It will be displayed after defined waiting time
 * to prevent flashing user experience when spinner is displayed and almost immediately replaced.
 *
 * @param delayMs - Waiting time before component gets rendered (in milliseconds)
 * @param title - Title subject, for example "Project List"
 * @param hasSkeleton - Display loading skeleton
 * @param isInline - Display component in inline style
 */
export const LoadingStateCard = ({ delayMs = 750, title, hasSkeleton = false, isInline = false }: ILoadingStateCard) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (delayMs) {
      const timer = setTimeout(() => setShow(true), delayMs);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [delayMs]);

  // skeleton needs to be shown immediately
  if (hasSkeleton) {
    return <Skeleton height="100%" width="100%" />;
  }

  if (show) {
    if (isInline) {
      return <LoadingSpinner isInline />;
    }

    return <StateCard title={`Loading ${title}`} icon={LoadingSpinner}></StateCard>;
  }
  return null;
};
