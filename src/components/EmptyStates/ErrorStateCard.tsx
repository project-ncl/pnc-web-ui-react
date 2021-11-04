import { CubesIcon } from '@patternfly/react-icons';
import { StateCard } from './StateCard';

interface IErrorStateCard {
  title: string;
  error?: string;
}

/**
 * Dump component representing error state.
 *
 * @param title - Title subject, for example "Project List"
 * @param error - Error details
 */
export const ErrorStateCard = ({ title, error }: IErrorStateCard) => (
  <StateCard title={`Error when loading ${title}`} icon={CubesIcon}>
    <pre>{error}</pre>
  </StateCard>
);
