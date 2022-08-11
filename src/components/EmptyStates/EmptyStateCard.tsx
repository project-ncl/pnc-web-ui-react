import { CubesIcon } from '@patternfly/react-icons';

import { StateCard } from './StateCard';

interface IEmptyStateCard {
  title: string;
}

/**
 * Dump component representing empty state.
 *
 * @param title - Title subject, for example "Project List"
 */
export const EmptyStateCard = ({ title }: IEmptyStateCard) => (
  <StateCard title={`${title} contains no data`} icon={CubesIcon}></StateCard>
);
