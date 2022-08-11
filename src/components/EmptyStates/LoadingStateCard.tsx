import { useEffect, useState } from 'react';

import { StateCard } from './StateCard';

const Spinner = () => (
  <span className="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
    <span className="pf-c-spinner__clipper" />
    <span className="pf-c-spinner__lead-ball" />
    <span className="pf-c-spinner__tail-ball" />
  </span>
);

interface ILoadingStateCard {
  delayMilliseconds?: number;
  title: string;
}

/**
 * Loading State component with delayed render. It will be displayed after defined waiting time
 * to prevent flashing user experience when spinner is displayed and almost immediately replaced.
 *
 * @param delayMilliseconds - Waiting time before component gets rendered
 * @param title - Title subject, for example "Project List"
 */
export const LoadingStateCard = ({ delayMilliseconds = 750, title }: ILoadingStateCard) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMilliseconds);

    return () => clearTimeout(timer);
  }, [delayMilliseconds]);

  if (show) {
    return <StateCard title={`Loading ${title}`} icon={Spinner}></StateCard>;
  }
  return null;
};
