import { Spinner } from '@patternfly/react-core';
import { useEffect, useState } from 'react';

import { StateCard } from './StateCard';

const LoadingSpinner = () => <Spinner diameter="75px" isSVG aria-label="Loading..." />;

interface ILoadingStateCard {
  delayMilliseconds?: number;
  title: string;
  isInline: boolean;
}

/**
 * Loading State component with delayed render. It will be displayed after defined waiting time
 * to prevent flashing user experience when spinner is displayed and almost immediately replaced.
 *
 * @param delayMilliseconds - Waiting time before component gets rendered
 * @param title - Title subject, for example "Project List"
 */
export const LoadingStateCard = ({ delayMilliseconds = 750, title, isInline }: ILoadingStateCard) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMilliseconds);

    return () => clearTimeout(timer);
  }, [delayMilliseconds]);

  if (show) {
    if (isInline) {
      return <Spinner isInline isSVG aria-label="Loading..." />;
    }

    return <StateCard title={`Loading ${title}`} icon={LoadingSpinner}></StateCard>;
  }
  return null;
};
