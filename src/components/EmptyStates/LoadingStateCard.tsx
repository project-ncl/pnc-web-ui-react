import { Skeleton, Spinner } from '@patternfly/react-core';
import { useEffect, useState } from 'react';

import { StateCard } from './StateCard';

const LoadingSpinner = () => <Spinner diameter="75px" isSVG aria-label="Loading..." />;

interface ILoadingStateCard {
  delayMilliseconds?: number;
  title: string;
  hasSkeleton?: boolean;
  isInline?: boolean;
}

/**
 * Loading State component with delayed render. It will be displayed after defined waiting time
 * to prevent flashing user experience when spinner is displayed and almost immediately replaced.
 *
 * @param delayMilliseconds - Waiting time before component gets rendered
 * @param title - Title subject, for example "Project List"
 * @param hasSkeleton - Display loading skeleton
 * @param isInline - Display component in inline style
 */
export const LoadingStateCard = ({
  delayMilliseconds = 750,
  title,
  hasSkeleton = false,
  isInline = false,
}: ILoadingStateCard) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMilliseconds);

    return () => clearTimeout(timer);
  }, [delayMilliseconds]);

  // skeleton needs to be shown immediately
  if (hasSkeleton) {
    return <Skeleton height="100%" width="100%" />;
  }

  if (show) {
    if (isInline) {
      // isInline - beta feature currently in this Patternfly component
      return <Spinner isInline isSVG aria-label="Loading..." />;
    }

    return <StateCard title={`Loading ${title}`} icon={LoadingSpinner}></StateCard>;
  }
  return null;
};
