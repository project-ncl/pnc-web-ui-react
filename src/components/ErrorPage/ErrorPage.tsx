import { PageTitles } from '../../utils/PageTitles';
import { StateCard } from '../EmptyStates/StateCard';
import { PageLayout } from '../PageLayout/PageLayout';
import styles from './ErrorPage.module.css';
import { CubesIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface IErrorPageProps {
  pageTitle: string;
  errorDescription: string;
}

export const ErrorPage = ({ pageTitle, errorDescription }: IErrorPageProps) => {
  return (
    <PageLayout title={pageTitle}>
      <StateCard
        title={pageTitle !== PageTitles.pageNotFound ? `Error when loading ${pageTitle}` : '404: Page does not exist'}
        icon={CubesIcon}
      >
        <pre>{errorDescription}</pre>
        <Link className={`${styles['return-button-margin']} pf-c-button pf-m-primary`} to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    </PageLayout>
  );
};
