import { CubesIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { StateCard } from '../EmptyStates/StateCard';
import { PageLayout } from '../PageLayout/PageLayout';
import styles from './ErrorPage.module.css';

interface IErrorPage {
  pageTitle?: string;
  errorDescription: string;
}

export const ErrorPage = ({ pageTitle, errorDescription }: IErrorPage) => {
  return (
    <PageLayout title={pageTitle ? pageTitle : 'Page not found'}>
      <StateCard title={pageTitle ? `Error when loading ${pageTitle}` : '404: Page does not exist'} icon={CubesIcon}>
        <pre>{errorDescription}</pre>
        <Link className={`${styles['return-button-margin']} pf-c-button pf-m-primary`} to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    </PageLayout>
  );
};
